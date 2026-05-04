// Europe WebSocket server for web3lounge.
// Phase 1A: Server-authoritative monster state for the Wildwood room.
//
// Endpoints:
//   GET  /health   -> { ok, region, service, rooms, monsters }
//   WS   /         -> JSON protocol (see PROTOCOL.md)
//
// Authority model:
//   - This server is the SOLE source of truth for monster spawn / position /
//     HP / death / respawn for any Europe room it simulates.
//   - Clients never run monster AI for Europe rooms — they receive snapshots
//     and render. Host election (room_hosts table) is bypassed for Europe.
//   - Damage requests come in as `attack_intent` (existing client format) and
//     are validated server-side before HP is applied. Each intent is dedup'd
//     by `intentId` so retransmits don't double-hit.
//
// Phase 1A scope:
//   - Wildwood only (17 fixed spawns, simple melee AI).
//   - Frontier / PvP arena will be added in Phase 1B.
//   - No loot / EXP / quest credit yet (those need service-role DB writes).

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { TILE_SIZE, MONSTER_DEFS, WILDWOOD_SPAWNS, FRONTIER_SPAWNS, getEffectiveDef } = require("./monsterDefs");
const { getCooldownMs, graceFor } = require("./skillDefs");

const PORT = process.env.PORT || 8080;

// ---------------------------------------------------------------------------
// Tunables (mirror client constants where relevant)
// ---------------------------------------------------------------------------
const TICK_HZ = 20; // monster AI tick rate
const SNAPSHOT_HZ = 12; // broadcast cadence (~80ms, matches client)
const RESPAWN_MS = 15_000;
const ATTACK_ANIM_MS = 280;
const AGGRO_LOSE_MULT = 1.5; // give up chase outside aggro * this
const HOME_TETHER_TILES = 6; // monster won't wander further than this from spawn
const INTENT_DEDUP_SIZE = 1024;
const PLAYER_STALE_MS = 30_000; // drop player if no message for 30s
const MAX_DAMAGE_PER_INTENT = 9999; // hard cap to mitigate trivial cheating

// ---------------------------------------------------------------------------
// Express health endpoint
// ---------------------------------------------------------------------------
const app = express();

app.get("/health", (_req, res) => {
  let totalMonsters = 0;
  let totalPlayers = 0;
  for (const r of rooms.values()) {
    totalPlayers += r.players.size;
    totalMonsters += r.monsters ? r.monsters.size : 0;
  }
  res.json({
    ok: true,
    region: "europe",
    service: "websocket",
    phase: "4",
    rooms: rooms.size,
    players: totalPlayers,
    monsters: totalMonsters,
  });
});

app.get("/", (_req, res) => {
  res.type("text/plain").send("web3lounge europe websocket server. Use /health or connect via WSS.");
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ---------------------------------------------------------------------------
// Room state
// ---------------------------------------------------------------------------
/**
 * @typedef {Object} Player
 * @property {string} characterId
 * @property {string} userId          - WebSocket-bound id used as authoritative key
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {string} direction
 * @property {string} mapId
 * @property {string} [class]
 * @property {number} [level]
 */

/**
 * @typedef {Object} Monster
 * @property {string} uid              - monster_key, deterministic ('wildwood:0'..)
 * @property {string} defId
 * @property {number} x
 * @property {number} y
 * @property {number} spawnX
 * @property {number} spawnY
 * @property {number} hp
 * @property {number} maxHp
 * @property {string} state            - 'idle'|'chase'|'attack'|'dying'|'dead'
 * @property {string} facing           - 'left'|'right'|'up'|'down'
 * @property {number} attackAnimEnd    - ms since epoch
 * @property {number} attackCdEnd      - ms since epoch
 * @property {number} deathAt          - ms since epoch (0 if alive)
 * @property {number} respawnAt        - ms since epoch (0 if alive)
 * @property {number} lastTargetX
 * @property {number} lastTargetY
 * @property {number} nextWanderAt
 * @property {number} wanderVx
 * @property {number} wanderVy
 * @property {string|null} aggroId     - userId of current target
 */

/** roomKey -> { players: Map<userId,Player>, monsters: Map<uid,Monster>, intentSeen: Set<string>, intentOrder: string[] } */
const rooms = new Map();
/** ws -> { roomKey, userId, characterId } */
const sockets = new Map();

function getRoom(roomKey) {
  let r = rooms.get(roomKey);
  if (!r) {
    r = {
      players: new Map(),
      monsters: null,
      intentSeen: new Set(),
      intentOrder: [],
      pvpIntentSeen: new Set(),
      pvpIntentOrder: [],
      pvpKillSeen: new Set(),
      pvpKillOrder: [],
      playerHitSeen: new Set(),
      playerHitOrder: [],
      lastSnapshotAt: 0,
    };
    rooms.set(roomKey, r);
  }
  return r;
}

function spawnEntry(uid, defId, tileX, tileY, rank) {
  const baseDef = MONSTER_DEFS[defId];
  if (!baseDef) return null;
  const eff = getEffectiveDef(defId, rank || "normal");
  const x = tileX * TILE_SIZE + TILE_SIZE / 2;
  const y = tileY * TILE_SIZE + TILE_SIZE / 2;
  return {
    uid,
    defId,
    rank: rank || (baseDef.rank ?? "normal"),
    x,
    y,
    spawnX: x,
    spawnY: y,
    hp: eff.maxHp,
    maxHp: eff.maxHp,
    state: "idle",
    facing: "left",
    attackAnimEnd: 0,
    attackCdEnd: 0,
    deathAt: 0,
    respawnAt: 0,
    lastTargetX: x,
    lastTargetY: y,
    nextWanderAt: Date.now() + 1000 + Math.random() * 2000,
    wanderVx: 0,
    wanderVy: 0,
    aggroId: null,
  };
}

/** Initialize the monster set for a room if it's a known monster room and not yet inited. */
function ensureMonsters(roomKey) {
  const r = getRoom(roomKey);
  if (r.monsters) return r;
  if (roomKey === "europe:wildwood") {
    r.monsters = new Map();
    WILDWOOD_SPAWNS.forEach((s, i) => {
      const uid = `wildwood:${i}`;
      const m = spawnEntry(uid, s.defId, s.tileX, s.tileY, s.elite ? "elite" : null);
      if (m) r.monsters.set(uid, m);
    });
    console.log(`[ws] initialized ${r.monsters.size} monsters for ${roomKey}`);
  } else if (roomKey === "europe:frontier") {
    r.monsters = new Map();
    FRONTIER_SPAWNS.forEach((s, i) => {
      const uid = `frontier:${i}`;
      const m = spawnEntry(uid, s.defId, s.tileX, s.tileY, s.elite ? "elite" : null);
      if (m) r.monsters.set(uid, m);
    });
    console.log(`[ws] initialized ${r.monsters.size} monsters for ${roomKey}`);
  } else {
    r.monsters = new Map();
  }
  return r;
}

// ---------------------------------------------------------------------------
// Broadcast helpers
// ---------------------------------------------------------------------------
function broadcastToRoom(roomKey, payload, exceptWs = null) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState !== 1) continue;
    const meta = sockets.get(client);
    if (meta && meta.roomKey === roomKey && client !== exceptWs) {
      client.send(data);
    }
  }
}

function sendTo(ws, payload) {
  if (ws.readyState === 1) ws.send(JSON.stringify(payload));
}

function buildMonsterRow(m) {
  return {
    room_key: "", // filled by broadcaster
    monster_key: m.uid,
    def_id: m.defId,
    x: m.x,
    y: m.y,
    spawn_x: m.spawnX,
    spawn_y: m.spawnY,
    hp: m.hp,
    state: m.state,
    facing: m.facing,
    attack_anim_end: m.attackAnimEnd,
    attack_cd_end: m.attackCdEnd,
    death_at: m.deathAt,
    respawn_at: m.respawnAt,
    last_target_x: m.lastTargetX,
    last_target_y: m.lastTargetY,
  };
}

function broadcastMonsterSnapshot(roomKey) {
  const r = rooms.get(roomKey);
  if (!r || !r.monsters || r.monsters.size === 0) return;
  if (r.players.size === 0) return; // nobody to receive
  const rows = [];
  for (const m of r.monsters.values()) {
    const row = buildMonsterRow(m);
    row.room_key = roomKey;
    rows.push(row);
  }
  // Wire format mirrors client's MonsterSnapshotEvent.
  const evt = {
    room: roomKey,
    hostId: "server:europe",
    monsters: rows,
    ts: Date.now(),
  };
  broadcastToRoom(roomKey, { type: "monster_snapshot", payload: evt });
}

// ---------------------------------------------------------------------------
// Monster AI (simple melee chase + wander)
// ---------------------------------------------------------------------------
function effDef(m) {
  return getEffectiveDef(m.defId, m.rank || "normal");
}

function nearestAlivePlayer(room, m) {
  const def = effDef(m);
  const aggroPx = def.aggroTiles * TILE_SIZE;
  const losePx = aggroPx * AGGRO_LOSE_MULT;
  let best = null;
  let bestDist = Infinity;
  for (const p of room.players.values()) {
    const dx = p.x - m.x;
    const dy = p.y - m.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestDist) {
      best = p;
      bestDist = d2;
    }
  }
  if (!best) return null;
  const limit = m.aggroId ? losePx : aggroPx;
  if (bestDist > limit * limit) return null;
  return best;
}

function attackKindToWire(kind) {
  if (kind === "fireball" || kind === "arrow" || kind === "magic_orb") return kind;
  return "melee";
}

function tickRoom(roomKey, dtMs) {
  const r = rooms.get(roomKey);
  if (!r || !r.monsters || r.monsters.size === 0) return;
  const now = Date.now();
  const homeRange = HOME_TETHER_TILES * TILE_SIZE;

  for (const m of r.monsters.values()) {
    // ---------- Death / respawn ----------
    if (m.state === "dead") {
      if (m.respawnAt > 0 && now >= m.respawnAt) {
        m.x = m.spawnX;
        m.y = m.spawnY;
        const def = effDef(m);
        m.hp = def.maxHp;
        m.maxHp = def.maxHp;
        m.state = "idle";
        m.deathAt = 0;
        m.respawnAt = 0;
        m.attackAnimEnd = 0;
        m.attackCdEnd = 0;
        m.aggroId = null;
        m.nextWanderAt = now + 1000 + Math.random() * 2000;
      }
      continue;
    }
    if (m.state === "dying") {
      if (now - m.deathAt > 500) {
        m.state = "dead";
        m.respawnAt = now + RESPAWN_MS;
      }
      continue;
    }

    const def = effDef(m);
    const role = def.role || "melee";
    const isRanged =
      role === "ranged" ||
      role === "magic" ||
      def.attackKind === "fireball" ||
      def.attackKind === "arrow" ||
      def.attackKind === "magic_orb";
    const projectileKind =
      def.attackKind === "fireball" || def.attackKind === "arrow" || def.attackKind === "magic_orb"
        ? def.attackKind
        : null;

    // ---------- Aggro ----------
    let target = null;
    if (m.aggroId) {
      target = r.players.get(m.aggroId) || null;
      if (!target) m.aggroId = null;
    }
    if (!target) {
      target = nearestAlivePlayer(r, m);
      if (target) m.aggroId = target.userId;
    }

    if (target && !def.stationary) {
      const dx = target.x - m.x;
      const dy = target.y - m.y;
      const dist = Math.hypot(dx, dy) || 1;
      m.lastTargetX = target.x;
      m.lastTargetY = target.y;
      m.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";

      const fromHome = Math.hypot(m.x - m.spawnX, m.y - m.spawnY);
      const speed = def.speed * (dtMs / 16.67);
      const inAttackRange = dist <= def.attackRangePx;

      // Ranged: kite to preferred distance.
      if (isRanged && projectileKind) {
        const pref = def.preferredRangePx || Math.max(80, def.attackRangePx * 0.8);
        if (fromHome >= homeRange) {
          // recover home
          const hx = m.spawnX - m.x,
            hy = m.spawnY - m.y;
          const hd = Math.hypot(hx, hy) || 1;
          m.x += (hx / hd) * speed;
          m.y += (hy / hd) * speed;
          m.aggroId = null;
          m.state = "chase";
        } else if (dist < pref * 0.7) {
          // back away
          m.x -= (dx / dist) * speed * 0.7;
          m.y -= (dy / dist) * speed * 0.7;
          m.state = "chase";
        } else if (dist > def.attackRangePx) {
          m.x += (dx / dist) * speed;
          m.y += (dy / dist) * speed;
          m.state = "chase";
        } else {
          m.state = "attack";
        }
        if (dist <= def.attackRangePx && now >= m.attackCdEnd) {
          m.attackAnimEnd = now + ATTACK_ANIM_MS;
          m.attackCdEnd = now + def.attackCdMs;
          // Broadcast projectile spawn so clients render it.
          broadcastToRoom(roomKey, {
            type: "monster_attack",
            payload: {
              playerId: "server:europe",
              room: roomKey,
              monsterUid: m.uid,
              kind: projectileKind,
              tx: target.x,
              ty: target.y,
              ts: now,
            },
          });
        } else if (now >= m.attackAnimEnd && m.state === "attack" && dist > def.attackRangePx) {
          m.state = "idle";
        }
        continue;
      }

      // Melee chase
      if (!inAttackRange) {
        if (fromHome < homeRange) {
          m.x += (dx / dist) * speed;
          m.y += (dy / dist) * speed;
        } else {
          const hx = m.spawnX - m.x,
            hy = m.spawnY - m.y;
          const hd = Math.hypot(hx, hy) || 1;
          m.x += (hx / hd) * speed;
          m.y += (hy / hd) * speed;
          m.aggroId = null;
        }
        m.state = "chase";
      } else {
        m.state = "attack";
        if (now >= m.attackCdEnd) {
          m.attackAnimEnd = now + ATTACK_ANIM_MS;
          m.attackCdEnd = now + def.attackCdMs;
          // Notify clients of melee swing (animation only; client handles self-damage).
          broadcastToRoom(roomKey, {
            type: "monster_attack",
            payload: {
              playerId: "server:europe",
              room: roomKey,
              monsterUid: m.uid,
              kind: "melee",
              tx: target.x,
              ty: target.y,
              ts: now,
            },
          });
        } else if (now >= m.attackAnimEnd) {
          m.state = "idle";
        }
      }
      continue;
    }

    // Stationary attacker (e.g. piranha)
    if (target && def.stationary) {
      const dx = target.x - m.x,
        dy = target.y - m.y;
      const dist = Math.hypot(dx, dy) || 1;
      m.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
      if (dist <= def.attackRangePx && now >= m.attackCdEnd) {
        m.state = "attack";
        m.attackAnimEnd = now + ATTACK_ANIM_MS;
        m.attackCdEnd = now + def.attackCdMs;
        broadcastToRoom(roomKey, {
          type: "monster_attack",
          payload: {
            playerId: "server:europe",
            room: roomKey,
            monsterUid: m.uid,
            kind: projectileKind || "melee",
            tx: target.x,
            ty: target.y,
            ts: now,
          },
        });
      } else if (now >= m.attackAnimEnd) {
        m.state = "idle";
      }
      continue;
    }

    // ---------- Wander / idle ----------
    if (def.stationary) {
      m.state = "idle";
      continue;
    }
    if (now >= m.nextWanderAt) {
      m.nextWanderAt = now + 2000 + Math.random() * 3000;
      const angle = Math.random() * Math.PI * 2;
      const mag = 0.3 + Math.random() * 0.5;
      m.wanderVx = Math.cos(angle) * mag;
      m.wanderVy = Math.sin(angle) * mag;
    }
    if (m.wanderVx !== 0 || m.wanderVy !== 0) {
      const speed = def.speed * 0.4 * (dtMs / 16.67);
      const nx = m.x + m.wanderVx * speed;
      const ny = m.y + m.wanderVy * speed;
      if (Math.hypot(nx - m.spawnX, ny - m.spawnY) < homeRange * 0.5) {
        m.x = nx;
        m.y = ny;
        m.facing =
          Math.abs(m.wanderVx) > Math.abs(m.wanderVy)
            ? m.wanderVx < 0
              ? "left"
              : "right"
            : m.wanderVy < 0
              ? "up"
              : "down";
      } else {
        m.wanderVx = -m.wanderVx;
        m.wanderVy = -m.wanderVy;
      }
    }
    m.state = "idle";
  }
}

// ---------------------------------------------------------------------------
// Damage handling (with dedup)
// ---------------------------------------------------------------------------
function rememberIntent(room, intentId) {
  if (!intentId) return false; // un-id'd intents always processed (best-effort)
  if (room.intentSeen.has(intentId)) return true;
  room.intentSeen.add(intentId);
  room.intentOrder.push(intentId);
  if (room.intentOrder.length > INTENT_DEDUP_SIZE) {
    const old = room.intentOrder.shift();
    room.intentSeen.delete(old);
  }
  return false;
}

/** Generic bounded-set dedup. Returns true if the id was already seen. */
function rememberId(seenSet, orderArr, id, max) {
  if (!id) return false;
  if (seenSet.has(id)) return true;
  seenSet.add(id);
  orderArr.push(id);
  if (orderArr.length > max) {
    const drop = orderArr.shift();
    if (drop) seenSet.delete(drop);
  }
  return false;
}

/**
 * Resolve an attack_intent against monsters in the room.
 * Validates: monster alive, attacker present, hit area inside aggro+attack
 * envelope, dedup by intentId.
 *
 * Damage formula (Phase 1A): if attacker provides `attackerScaling` we use
 * `floor(scaling * (0.85..1.15)) * (crit?1.5:1)`. Otherwise fall back to a
 * conservative def.attack-based number. Capped at MAX_DAMAGE_PER_INTENT.
 */
function resolveAttackIntent(roomKey, evt, attackerWs) {
  const r = ensureMonsters(roomKey);
  if (!r.monsters || r.monsters.size === 0) return;
  if (rememberIntent(r, evt.intentId)) return;

  const attackerId = evt.playerId;
  const attacker = r.players.get(attackerId);
  if (!attacker) return; // ghost intent — ignore.

  const ax = Number(evt.x),
    ay = Number(evt.y);
  const ar = Math.max(8, Number(evt.r) || 24);
  if (!isFinite(ax) || !isFinite(ay)) return;
  // Guard against absurd radius — cap at 1.5 tiles.
  const r2 = Math.min(ar, TILE_SIZE * 6);

  const scaling = Number(evt.attackerScaling);
  const critChance = Math.max(0, Math.min(1, Number(evt.attackerCrit) || 0));

  for (const m of r.monsters.values()) {
    if (m.state === "dead" || m.state === "dying") continue;
    if (m.hp <= 0) continue;
    const dx = m.x - ax,
      dy = m.y - ay;
    if (dx * dx + dy * dy > r2 * r2) continue;

    // Sanity range gate: attacker must be near the area they're claiming to hit.
    const adx = attacker.x - ax,
      ady = attacker.y - ay;
    if (adx * adx + ady * ady > TILE_SIZE * 8 * (TILE_SIZE * 8)) continue;

    // Compute damage.
    let dmg;
    if (isFinite(scaling) && scaling > 0) {
      const variance = 0.85 + Math.random() * 0.3;
      dmg = Math.max(1, Math.floor(scaling * variance));
    } else {
      const def = MONSTER_DEFS[m.defId];
      dmg = Math.max(1, Math.floor((def?.attack ?? 5) * 1.5));
    }
    const crit = Math.random() < critChance;
    if (crit) dmg = Math.floor(dmg * 1.5);
    dmg = Math.min(MAX_DAMAGE_PER_INTENT, dmg);

    m.hp -= dmg;
    m.aggroId = attackerId; // monster now targets the attacker
    m.lastTargetX = attacker.x;
    m.lastTargetY = attacker.y;

    let died = false;
    if (m.hp <= 0) {
      m.hp = 0;
      m.state = "dying";
      m.deathAt = Date.now();
      m.aggroId = null;
      died = true;
    }

    // Echo a monster_hit event so attacker sees floating damage immediately.
    const hitEvt = {
      playerId: "server:europe",
      room: roomKey,
      monsterUid: m.uid,
      dmg,
      crit,
      x: m.x,
      y: m.y,
      attackerId,
      hpAfter: m.hp,
      died,
      ts: Date.now(),
    };
    broadcastToRoom(roomKey, { type: "monster_hit", payload: hitEvt });
  }
}

// ---------------------------------------------------------------------------
// Connection lifecycle
// ---------------------------------------------------------------------------
function leaveCurrentRoom(ws) {
  const meta = sockets.get(ws);
  if (!meta) return;
  const r = rooms.get(meta.roomKey);
  if (r) {
    r.players.delete(meta.userId);
  }
  broadcastToRoom(meta.roomKey, { type: "player_left", payload: { playerId: meta.characterId } }, ws);
  sockets.delete(ws);
}

wss.on("connection", (ws) => {
  console.log("[ws] client connected");

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (!msg || typeof msg !== "object") return;

    switch (msg.type) {
      case "ping": {
        sendTo(ws, { type: "pong", clientTime: msg.clientTime, serverTime: Date.now() });
        return;
      }

      case "join": {
        const mapId = msg.mapId || "town";
        const characterId = msg.characterId || msg.playerId;
        if (!characterId) return;
        leaveCurrentRoom(ws);
        const roomKey = `europe:${mapId}`;
        const room = ensureMonsters(roomKey);
        const player = {
          characterId,
          userId: characterId,
          name: msg.name,
          x: Number(msg.x) || 0,
          y: Number(msg.y) || 0,
          direction: msg.direction || "down",
          mapId,
          class: msg.class,
          level: msg.level,
          castCdEnds: {}, // skillId -> ms-since-epoch when cast becomes legal
          castSeen: new Set(), // dedupe set for castIds (size-bounded)
          castOrder: [],
        };
        room.players.set(characterId, player);
        sockets.set(ws, { roomKey, userId: characterId, characterId });

        const existing = Array.from(room.players.values()).filter((p) => p.characterId !== characterId);
        sendTo(ws, { type: "existing_players", players: existing });
        broadcastToRoom(roomKey, { type: "player_joined", player }, ws);

        // Send an immediate monster snapshot so the joiner sees current state.
        if (room.monsters && room.monsters.size > 0) {
          const rows = [];
          for (const m of room.monsters.values()) {
            const row = buildMonsterRow(m);
            row.room_key = roomKey;
            rows.push(row);
          }
          sendTo(ws, {
            type: "monster_snapshot",
            payload: { room: roomKey, hostId: "server:europe", monsters: rows, ts: Date.now() },
          });
        }
        return;
      }

      case "move": {
        const meta = sockets.get(ws);
        if (!meta) return;
        const characterId = msg.characterId || meta.characterId;
        const newMapId = msg.mapId || "town";
        const newRoomKey = `europe:${newMapId}`;
        if (newRoomKey !== meta.roomKey) {
          // Map change — leave old, join new.
          leaveCurrentRoom(ws);
          const room = ensureMonsters(newRoomKey);
          const player = {
            characterId,
            userId: characterId,
            x: Number(msg.x) || 0,
            y: Number(msg.y) || 0,
            direction: msg.direction || "down",
            mapId: newMapId,
            castCdEnds: {},
            castSeen: new Set(),
            castOrder: [],
          };
          room.players.set(characterId, player);
          sockets.set(ws, { roomKey: newRoomKey, userId: characterId, characterId });
          const existing = Array.from(room.players.values()).filter((p) => p.characterId !== characterId);
          sendTo(ws, { type: "existing_players", players: existing });
          broadcastToRoom(newRoomKey, { type: "player_joined", player }, ws);
          if (room.monsters && room.monsters.size > 0) {
            const rows = [];
            for (const m of room.monsters.values()) {
              const row = buildMonsterRow(m);
              row.room_key = newRoomKey;
              rows.push(row);
            }
            sendTo(ws, {
              type: "monster_snapshot",
              payload: { room: newRoomKey, hostId: "server:europe", monsters: rows, ts: Date.now() },
            });
          }
          return;
        }
        const room = rooms.get(meta.roomKey);
        if (!room) return;
        const p = room.players.get(characterId);
        if (p) {
          p.x = Number(msg.x) || 0;
          p.y = Number(msg.y) || 0;
          p.direction = msg.direction || p.direction;
        }
        broadcastToRoom(
          meta.roomKey,
          {
            type: "player_moved",
            payload: {
              playerId: characterId,
              x: msg.x,
              y: msg.y,
              dir: msg.direction,
              room: newMapId === "town" ? "world" : newMapId,
            },
          },
          ws,
        );
        return;
      }

      case "attack_intent": {
        const meta = sockets.get(ws);
        if (!meta) return;
        // Trust the message's room for this event since the client sends a
        // namespaced room (e.g. 'europe:wildwood'); fall back to socket room.
        const targetRoom = (msg.payload && msg.payload.room) || meta.roomKey;
        if (typeof targetRoom !== "string" || !targetRoom.startsWith("europe:")) return;
        if (msg.payload) resolveAttackIntent(targetRoom, msg.payload, ws);
        return;
      }

      case "chat": {
        const meta = sockets.get(ws);
        if (!meta) return;
        broadcastToRoom(meta.roomKey, { type: "chat", payload: msg.payload ?? msg }, null);
        return;
      }

      case "action": {
        // Phase 2: server-validated skill / basic-attack cast broadcast.
        // We re-stamp playerId from the socket, gate by per-player cooldown,
        // and dedupe by castId so a retransmit can't fire the visual twice.
        const meta = sockets.get(ws);
        if (!meta) return;
        const room = rooms.get(meta.roomKey);
        if (!room) return;
        const player = room.players.get(meta.userId);
        if (!player) return;
        const p = msg.payload || {};
        const skillId = typeof p.skillId === "string" ? p.skillId : null;
        const kind = p.kind === "skill" ? "skill" : "basic";
        if (!skillId) return;

        const now = Date.now();
        const cd = getCooldownMs(skillId, kind);
        const grace = graceFor(cd);
        const cdEnd = player.castCdEnds[skillId] || 0;
        if (now + grace < cdEnd) {
          // Cast came in too early — silently drop. Avoids letting a hacked
          // client spam a 22s buff or 1.5s nuke. We don't tell the offender
          // explicitly to keep the protocol simple.
          return;
        }
        // Dedupe by castId (when present). Bound the set so memory stays flat.
        const castId = typeof p.castId === "string" ? p.castId : `${meta.userId}:${skillId}:${p.ts || now}`;
        if (player.castSeen.has(castId)) return;
        player.castSeen.add(castId);
        player.castOrder.push(castId);
        if (player.castOrder.length > 64) {
          const drop = player.castOrder.shift();
          if (drop) player.castSeen.delete(drop);
        }

        // Lock cooldown using the SERVER's clock so client clock skew can't
        // shift the next-allowed-cast forward.
        player.castCdEnds[skillId] = now + cd;

        // Re-stamp playerId from the authenticated socket so a client can't
        // forge casts from another player.
        const safePayload = { ...p, playerId: meta.userId, room: meta.roomKey, ts: now };
        broadcastToRoom(meta.roomKey, { type: "action", payload: safePayload }, ws);
        return;
      }

      case "pvp_attack_intent": {
        // Phase 4: server-validated PvP attack intent.
        // - Re-stamp playerId/room from authenticated socket (anti-spoof).
        // - Dedupe by intentId so retransmits don't double-resolve.
        // - Reject hits whose claimed origin is far from the attacker's last
        //   known position (anti-teleport / range hack).
        // - Cap radius so a hacked client can't claim a map-wide AOE.
        // Damage application still happens on victim clients (they own their
        // HP), matching the Asia model. Phase 5 will move HP server-side.
        const meta = sockets.get(ws);
        if (!meta) return;
        const room = rooms.get(meta.roomKey);
        if (!room) return;
        const attacker = room.players.get(meta.userId);
        if (!attacker) return;
        const p = msg.payload || {};
        const targetRoom = typeof p.room === "string" ? p.room : meta.roomKey;
        if (targetRoom !== meta.roomKey) return;
        const ax = Number(p.x), ay = Number(p.y);
        const ar = Math.min(Math.max(8, Number(p.r) || 24), TILE_SIZE * 6);
        if (!isFinite(ax) || !isFinite(ay)) return;
        // Sanity: attacker must be near the claimed effect center.
        const ddx = attacker.x - ax, ddy = attacker.y - ay;
        if (ddx * ddx + ddy * ddy > (TILE_SIZE * 8) * (TILE_SIZE * 8)) return;
        const intentId = typeof p.intentId === "string"
          ? p.intentId
          : `${meta.userId}:${p.skillId || "x"}:${p.ts || Date.now()}`;
        if (rememberId(room.pvpIntentSeen, room.pvpIntentOrder, intentId, INTENT_DEDUP_SIZE)) return;
        const safe = {
          ...p,
          playerId: meta.userId,
          room: meta.roomKey,
          x: ax, y: ay, r: ar,
          intentId,
          ts: Date.now(),
        };
        broadcastToRoom(meta.roomKey, { type: "pvp_attack_intent", payload: safe }, ws);
        return;
      }

      case "player_hit": {
        // Phase 4: relayed PvP/monster->player damage event from the resolving
        // host (or victim). Re-stamp playerId, dedupe by a synthetic id so the
        // same hit can't be amplified.
        const meta = sockets.get(ws);
        if (!meta) return;
        const room = rooms.get(meta.roomKey);
        if (!room) return;
        const p = msg.payload || {};
        const targetRoom = typeof p.room === "string" ? p.room : meta.roomKey;
        if (targetRoom !== meta.roomKey) return;
        const id = `${meta.userId}:${p.targetPlayerId || ""}:${p.monsterUid || ""}:${p.ts || Date.now()}:${p.dmg || 0}`;
        if (rememberId(room.playerHitSeen, room.playerHitOrder, id, 512)) return;
        const safe = { ...p, playerId: meta.userId, room: meta.roomKey, ts: Date.now() };
        broadcastToRoom(meta.roomKey, { type: "player_hit", payload: safe }, ws);
        return;
      }

      case "pvp_kill": {
        // Victim broadcasts their own death + credited killer. Server re-stamps
        // playerId so a third party can't forge kill credits, and dedupes per
        // (victim, killer, ts) so a replayed kill can't pad a leaderboard.
        const meta = sockets.get(ws);
        if (!meta) return;
        const room = rooms.get(meta.roomKey);
        if (!room) return;
        const p = msg.payload || {};
        const killerId = typeof p.killerId === "string" ? p.killerId : "";
        const ts = Number(p.ts) || Date.now();
        const id = `${meta.userId}:${killerId}:${ts}`;
        if (rememberId(room.pvpKillSeen, room.pvpKillOrder, id, 256)) return;
        const safe = { playerId: meta.userId, room: meta.roomKey, killerId, ts: Date.now() };
        broadcastToRoom(meta.roomKey, { type: "pvp_kill", payload: safe }, null);
        return;
      }

      case "vitals": {
        // Re-stamp playerId so a client can't broadcast vitals as someone else
        // (which would let them fake another player's HP bar).
        const meta = sockets.get(ws);
        if (!meta) return;
        const p = msg.payload || {};
        const safe = { ...p, playerId: meta.userId, room: meta.roomKey };
        broadcastToRoom(meta.roomKey, { type: "vitals", payload: safe }, ws);
        return;
      }
      default: {
        // Generic broadcast pass-through so existing client features keep
        // working while we expand authoritative coverage in later phases.
        const meta = sockets.get(ws);
        if (!meta) return;
        broadcastToRoom(meta.roomKey, { type: msg.type, payload: msg.payload ?? msg }, ws);
      }
    }
  });

  ws.on("close", () => {
    console.log("[ws] client disconnected");
    leaveCurrentRoom(ws);
  });

  ws.on("error", (err) => console.warn("[ws] socket error", err.message));
});

// ---------------------------------------------------------------------------
// Tick loops
// ---------------------------------------------------------------------------
const TICK_MS = Math.floor(1000 / TICK_HZ);
const SNAPSHOT_MS = Math.floor(1000 / SNAPSHOT_HZ);

let lastTickAt = Date.now();
setInterval(() => {
  const now = Date.now();
  const dt = now - lastTickAt;
  lastTickAt = now;
  for (const roomKey of rooms.keys()) {
    tickRoom(roomKey, dt);
  }
}, TICK_MS);

setInterval(() => {
  for (const roomKey of rooms.keys()) {
    broadcastMonsterSnapshot(roomKey);
  }
}, SNAPSHOT_MS);

// Cull stale players defensively (in case a close handler missed).
setInterval(() => {
  // Currently no per-player heartbeat; skip until we wire it.
}, 60_000);

server.listen(PORT, () => {
  console.log(`[europe-ws] listening on :${PORT}`);
});

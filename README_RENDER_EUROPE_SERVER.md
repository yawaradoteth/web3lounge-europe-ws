# Europe WebSocket Server (Render)

Authoritative live-gameplay backend for the Europe region of web3lounge.

## Status

- **Phase 1A — Server-authoritative monsters for Wildwood** ✅
- **Phase 1B — Frontier monsters & ranged/magic AI** ✅
  - All 60 monster defs ported (incl. role/rank/projectile colors).
  - 172 deterministic Frontier spawns simulated server-side.
  - Ranged & magic mobs kite to `preferredRangePx`, broadcast `monster_attack`
    so clients render the matching themed projectile (fireball/arrow/orb).
  - Stationary mobs (piranha) attack in place.
  - Elite-tagged spawns auto-scaled (HP × 2.2, ATK × 1.5).
- **Phase 2 — Server-validated skill casts** ✅
  - All `action` events (basic + skill) flow through the server, which
    enforces per-player + per-skill cooldown using `skillDefs.js`, dedupes
    by `castId`, and re-stamps `playerId`/`room`/`ts` before fanning out.
  - Honest clients see no behavior change. Hacked clients can no longer
    spam casts faster than the design cooldown (small grace window only).
- **Phase 3 — Loot drops on monster death** ✅
  - When the server confirms a monster died, the credited killer's client
    rolls loot via the existing client-side tables (gold, consumables,
    equipment, elite/mini-boss guarantees) and broadcasts `loot_drop`.
  - The WS server dedupes drops by `loot.id` (capped at 512) and re-stamps
    `playerId`/`room`/`ts` so a hacked client can't replay drop lists.
  - Item rolls move fully server-side in Phase 5/6 once `items.ts` /
    `monsters.ts` are ported (or the service-role key is wired in).
- **Phase 4 — Server-validated PvP intents & kill confirms** ✅
  - `pvp_attack_intent`, `player_hit`, `pvp_kill`, and `vitals` all flow
    through the server, which re-stamps `playerId`/`room`/`ts` from the
    authenticated socket so a hacked client can't forge attacks, hits,
    kills, or HP bars on behalf of another player.
  - Range gate: PvP intent center must be within ~8 tiles of the attacker's
    last known position; AOE radius capped at 6 tiles.
  - Dedupe rings: `intentId` (1024), `player_hit` synthetic id (512),
    `pvp_kill` (256). Replays are silently dropped.
  - HP application still lives on the victim client (matches Asia model);
    Phase 5/6 will move HP/EXP/inventory writes server-side once the
    service-role key is wired in.
- Phase 5 — Quest progress writes (needs `SUPABASE_SERVICE_ROLE_KEY`): TODO.
- Phase 6 — Inventory/EXP/gold writes (needs service-role key): TODO.

## Endpoints

- `GET /health` → `{ ok, region, service, phase, rooms, players, monsters }`
- `WS /` → JSON protocol (see Wire Protocol below)

## Render Deployment

This is a **separate** Render Web Service from the frontend. Do **not**
overwrite the frontend service.

1. Push this `europe-ws-server/` directory to a repo (or use a monorepo
   subdirectory).
2. Render → New → Web Service.
3. Settings:
   - **Name**: `web3lounge-europe-ws`
   - **Region**: Frankfurt (EU Central)
   - **Runtime**: Node
   - **Root Directory**: `europe-ws-server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Verify after deploy:
   - `https://web3lounge-europe-ws.onrender.com/health` returns
     `{ ok: true, region: "europe", service: "websocket", phase: "3", ... }`.
   - In-game: open Wildwood as two Europe characters, both should see the
     same monsters in the same positions, take damage in sync, and see
     deaths/respawns in sync.

The client is already configured to connect to
`wss://web3lounge-europe-ws.onrender.com` (see `src/game/servers.ts`).

## Wire Protocol (Phase 1A)

Client → server:

```jsonc
// Latency
{ "type": "ping", "clientTime": 1700000000000 }

// Join a room
{ "type": "join", "characterId": "...", "name": "...", "mapId": "wildwood",
  "x": 200, "y": 300, "direction": "down", "class": "swordsman", "level": 7 }

// Movement update
{ "type": "move", "characterId": "...", "mapId": "wildwood",
  "x": 210, "y": 305, "direction": "right" }

// Attack intent — server validates and resolves
{ "type": "attack_intent", "payload": {
    "playerId": "...", "room": "europe:wildwood",
    "skillId": "basic", "x": 220, "y": 305, "r": 28,
    "intentId": "<unique>", "attackerScaling": 12,
    "attackerCrit": 0.1, "attackerLevel": 7, "ts": 1700000000000
  }
}

// Chat
{ "type": "chat", "payload": { "playerId": "...", "text": "hi", "room": "europe:wildwood" } }
```

Server → client:

```jsonc
// Latency
{ "type": "pong", "clientTime": 1700000000000, "serverTime": 1700000000010 }

// Roster on join
{ "type": "existing_players", "players": [ ... ] }
{ "type": "player_joined", "player": { ... } }
{ "type": "player_left", "payload": { "playerId": "..." } }
{ "type": "player_moved", "payload": { "playerId": "...", "x": 210, "y": 305, "dir": "right", "room": "wildwood" } }

// Monster state (12 Hz, plus immediate on join)
{ "type": "monster_snapshot", "payload": {
    "room": "europe:wildwood", "hostId": "server:europe",
    "monsters": [ { "monster_key": "wildwood:0", "def_id": "slime",
                    "x": 192, "y": 384, "hp": 25, "state": "idle", ... } ],
    "ts": 1700000000000
  }
}

// Damage applied
{ "type": "monster_hit", "payload": {
    "playerId": "server:europe", "room": "europe:wildwood",
    "monsterUid": "wildwood:0", "dmg": 12, "crit": false,
    "x": 192, "y": 384, "attackerId": "...", "hpAfter": 13,
    "died": false, "ts": 1700000000000
  }
}
```

## Authority Rules (Phase 1A)

- **Monster HP / position / state**: server only. Clients render snapshots.
- **Damage validation**: server checks attacker exists, attacker is within
  ~8 tiles of the claimed hit area, hit radius capped at 6 tiles, monster
  is alive. Damage capped at 9999 per intent.
- **Dedup**: `intentId` is remembered for the last 1024 intents per room.
  Re-sent intents are ignored.
- **Monster damage to players**: still applied locally on each client
  (existing Asia behavior preserved). Will move to server in Phase 4.

## Asia / Europe Isolation

- Asia continues to use Supabase Realtime + `room_hosts` host election.
  Zero changes to that path.
- Europe channel name and monster room keys are namespaced with `europe:`.
- The client gates `tryAcquireHost`, `releaseHost`, `loadMonsterSnapshot`,
  and `writeMonsterSnapshot` with `if (TRANSPORT === 'websocket') return`.

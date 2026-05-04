// Europe WebSocket server for web3lounge.
// Deployed as a separate Render Web Service (NOT the frontend).
// Public host (after deploy): web3lounge-europe-ws.onrender.com
//
// Endpoints:
//   GET  /health   -> { ok: true, region: "europe", service: "websocket" }
//   WS   /         -> JSON protocol: ping/pong, join, move, chat
//
// Listens on process.env.PORT (Render injects this).

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/health', (_req, res) => {
  res.json({ ok: true, region: 'europe', service: 'websocket' });
});

app.get('/', (_req, res) => {
  res.type('text/plain').send('web3lounge europe websocket server. Use /health or connect via WSS.');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

/** roomKey -> Map<characterId, playerState> */
const rooms = new Map();
/** ws -> { roomKey, characterId } */
const sockets = new Map();

function getRoom(roomKey) {
  let r = rooms.get(roomKey);
  if (!r) { r = new Map(); rooms.set(roomKey, r); }
  return r;
}

function broadcastToRoom(roomKey, payload, exceptWs) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState !== 1) continue;
    const meta = sockets.get(client);
    if (meta && meta.roomKey === roomKey && client !== exceptWs) {
      client.send(data);
    }
  }
}

function leaveCurrentRoom(ws) {
  const meta = sockets.get(ws);
  if (!meta) return;
  const room = rooms.get(meta.roomKey);
  if (room) {
    room.delete(meta.characterId);
    if (room.size === 0) rooms.delete(meta.roomKey);
  }
  broadcastToRoom(meta.roomKey, { type: 'player_left', payload: { playerId: meta.characterId } }, ws);
  sockets.delete(ws);
}

wss.on('connection', (ws) => {
  console.log('[ws] client connected');

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'ping': {
        ws.send(JSON.stringify({ type: 'pong', clientTime: msg.clientTime, serverTime: Date.now() }));
        return;
      }
      case 'join': {
        const mapId = msg.mapId || 'town';
        const characterId = msg.characterId || msg.playerId;
        if (!characterId) return;
        leaveCurrentRoom(ws);
        const roomKey = `europe:${mapId}`;
        const player = {
          playerId: characterId,
          characterId,
          name: msg.name,
          x: msg.x ?? 0,
          y: msg.y ?? 0,
          direction: msg.direction ?? 'down',
          mapId,
          class: msg.class,
          level: msg.level,
        };
        getRoom(roomKey).set(characterId, player);
        sockets.set(ws, { roomKey, characterId });
        const existing = Array.from(getRoom(roomKey).values()).filter(p => p.characterId !== characterId);
        ws.send(JSON.stringify({ type: 'existing_players', players: existing }));
        broadcastToRoom(roomKey, { type: 'player_joined', player }, ws);
        return;
      }
      case 'move': {
        const meta = sockets.get(ws);
        if (!meta) return;
        const characterId = msg.characterId || meta.characterId;
        const newMapId = msg.mapId || 'town';
        const newRoomKey = `europe:${newMapId}`;
        if (newRoomKey !== meta.roomKey) {
          // Map change — leave old, join new.
          leaveCurrentRoom(ws);
          const player = { playerId: characterId, characterId, x: msg.x, y: msg.y, direction: msg.direction, mapId: newMapId };
          getRoom(newRoomKey).set(characterId, player);
          sockets.set(ws, { roomKey: newRoomKey, characterId });
          const existing = Array.from(getRoom(newRoomKey).values()).filter(p => p.characterId !== characterId);
          ws.send(JSON.stringify({ type: 'existing_players', players: existing }));
          broadcastToRoom(newRoomKey, { type: 'player_joined', player }, ws);
          return;
        }
        const room = getRoom(meta.roomKey);
        const p = room.get(characterId);
        if (p) { p.x = msg.x; p.y = msg.y; p.direction = msg.direction; }
        broadcastToRoom(meta.roomKey, {
          type: 'player_moved',
          payload: { playerId: characterId, x: msg.x, y: msg.y, dir: msg.direction, room: newMapId === 'town' ? 'world' : newMapId },
        }, ws);
        return;
      }
      case 'chat': {
        const meta = sockets.get(ws);
        if (!meta) return;
        broadcastToRoom(meta.roomKey, { type: 'chat', payload: msg.payload ?? msg }, null);
        return;
      }
      default: {
        const meta = sockets.get(ws);
        if (!meta) return;
        broadcastToRoom(meta.roomKey, { type: msg.type, payload: msg.payload ?? msg }, ws);
      }
    }
  });

  ws.on('close', () => {
    console.log('[ws] client disconnected');
    leaveCurrentRoom(ws);
  });

  ws.on('error', (err) => console.warn('[ws] socket error', err.message));
});

server.listen(PORT, () => {
  console.log(`[europe-ws] listening on :${PORT}`);
});

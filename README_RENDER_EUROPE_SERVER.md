# Web3 Lounge — Europe WebSocket on Render

This service is a small Node.js HTTP + WebSocket server intended to run on [Render](https://render.com) in a **European region** (for example **Frankfurt**) so clients get lower latency to EU users.

## What it exposes

| Endpoint | Purpose |
|----------|---------|
| `GET /` or `GET /health` | JSON health check for Render and load balancers |
| `WebSocket /ws` | Application WebSocket (JSON messages; supports `ping` / `pong` and generic echo) |

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | **Set by Render** — do not hardcode in production |
| `WS_PING_INTERVAL_MS` | `30000` | Interval for WebSocket `ping` frames to keep connections alive behind proxies |

## Local development

```bash
npm install
npm run dev
```

- Health: `http://localhost:8080/health`
- WebSocket URL: `ws://localhost:8080/ws`

## Deploy on Render (Europe)

1. Push this repo to GitHub (or connect your Git provider to Render).
2. In the Render dashboard, create a **Web Service**.
3. **Region:** choose **Frankfurt** (or another EU region Render offers).
4. **Runtime:** Node.
5. **Build command:** `npm install`
6. **Start command:** `npm start`
7. **Health check path:** `/health` (optional but recommended).

After deploy, Render assigns a URL like `https://your-service.onrender.com`. Use WebSockets with the same host and TLS:

- `wss://your-service.onrender.com/ws`

Render’s free tier may spin services down after idle time; plan capacity and region according to your product needs.

## Notes

- The server responds to `SIGTERM` / `SIGINT` so Render can stop it cleanly.
- Client messages that are valid JSON with `{ "type": "ping", "t": ... }` receive `{ "type": "pong", "t": ... }`.

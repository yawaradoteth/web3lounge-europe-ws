# Europe WebSocket Server — Render Deployment

This is a **separate** service from the frontend. The frontend currently lives at
`web3lounge.onrender.com`, so DO NOT overwrite it. Deploy this as a new Render
Web Service.

## Why a separate service?

A `GET https://web3lounge.onrender.com/health` returns the frontend HTML (200
text/html), proving that domain is the static/SPA frontend. WebSocket upgrades
also fail there. We need a dedicated Node service.

## Deploy steps

1. Push `europe-ws-server/` to a Git repo (or use this monorepo with a Root
   Directory of `europe-ws-server`).
2. Render → **New +** → **Web Service**.
3. Connect the repo.
4. Settings:
   - **Name**: `web3lounge-europe-ws` (final URL: `https://web3lounge-europe-ws.onrender.com`)
   - **Region**: Frankfurt (EU Central)
   - **Runtime**: Node
   - **Root Directory**: `europe-ws-server` (if monorepo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free is fine to start
5. Create Web Service. Wait for "Live".

## Verify

```
curl https://web3lounge-europe-ws.onrender.com/health
# -> {"ok":true,"region":"europe","service":"websocket"}
```

WebSocket: `wss://web3lounge-europe-ws.onrender.com`

## Notes

- The server listens on `process.env.PORT` (Render injects this). Do not hardcode a port.
- Free Render web services sleep after inactivity; first ping after sleep can
  take 30–60s. Upgrade the plan if you need always-on.
- The frontend at `web3lounge.onrender.com` is untouched.

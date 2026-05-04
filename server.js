const http = require("http");
const { WebSocketServer } = require("ws");

const PORT = Number(process.env.PORT) || 8080;
const PING_INTERVAL_MS = Number(process.env.WS_PING_INTERVAL_MS) || 30000;

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "web3lounge-europe-ws" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket, req) => {
  const id = req.socket.remoteAddress ?? "unknown";
  console.log("[ws] client connected", id);

  socket.send(
    JSON.stringify({ type: "welcome", message: "connected to europe ws" })
  );

  socket.on("message", (data, isBinary) => {
    if (isBinary) return;
    let text;
    try {
      text = data.toString();
    } catch {
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { type: "echo", raw: text };
    }
    if (parsed && parsed.type === "ping") {
      socket.send(JSON.stringify({ type: "pong", t: parsed.t ?? null }));
      return;
    }
    socket.send(JSON.stringify({ type: "echo", payload: parsed }));
  });

  socket.on("close", (code, reason) => {
    console.log("[ws] client closed", id, code, reason.toString());
  });

  socket.on("error", (err) => {
    console.error("[ws] error", id, err.message);
  });
});

const pingTimer = setInterval(() => {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.ping();
    }
  }
}, PING_INTERVAL_MS);

server.listen(PORT, () => {
  console.log(`http + ws listening on ${PORT} (ws path /ws)`);
});

function shutdown(signal) {
  console.log(signal, "shutting down");
  clearInterval(pingTimer);
  wss.close(() => {
    server.close(() => process.exit(0));
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

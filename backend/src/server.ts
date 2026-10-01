import { createServer } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { initializeDatabase, closeDatabase } from "./db.js";
import { Simulator } from "./simulator.js";

const simulator = new Simulator();
const app = createApp(simulator, config.clientUrl);
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/ws",
  verifyClient: ({ origin }: { origin: string }) => !origin || origin === config.clientUrl,
});
simulator.setBroadcaster((message) => {
  const payload = JSON.stringify(message);
  for (const client of wsServer.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
});
await initializeDatabase(simulator.list()).catch(error => console.warn("PostgreSQL unavailable; continuing with in-memory simulation.", error.message));
simulator.start();
const shutdown = async (signal: string) => {
  console.log(`${signal} received; shutting down gracefully`);
  simulator.stop();
  for (const client of wsServer.clients) client.terminate();
  await new Promise<void>((resolve) => wsServer.close(() => resolve()));
  await closeDatabase();
  await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
  process.exit(0);
};
httpServer.listen(config.port, () => console.log(`IoT API listening on http://localhost:${config.port}`));
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

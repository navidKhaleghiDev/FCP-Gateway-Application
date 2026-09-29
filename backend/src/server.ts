import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { initializeDatabase, closeDatabase } from "./db.js";
import { Simulator } from "./simulator.js";

const simulator = new Simulator();
const app = createApp(simulator, config.clientUrl);
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: config.clientUrl, credentials: false } });
simulator.setIo(io);
io.on("connection", socket => socket.emit("sync:ready", { timestamp: new Date().toISOString() }));
await initializeDatabase(simulator.list()).catch(error => console.warn("PostgreSQL unavailable; continuing with in-memory simulation.", error.message));
simulator.start();
const shutdown = async (signal: string) => {
  console.log(`${signal} received; shutting down gracefully`);
  simulator.stop();
  io.close();
  await closeDatabase();
  await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
  process.exit(0);
};
httpServer.listen(config.port, () => console.log(`IoT API listening on http://localhost:${config.port}`));
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

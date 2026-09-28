import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { initializeDatabase, closeDatabase } from "./db.js";
import { Simulator } from "./simulator.js";

const simulator = new Simulator();
const httpServer = createServer(createApp(simulator, config.clientUrl));
const io = new Server(httpServer, { cors: { origin: config.clientUrl } });
simulator.setIo(io);
io.on("connection", socket => socket.emit("sync:ready", { timestamp: new Date().toISOString() }));
await initializeDatabase(simulator.list()).catch(error => console.warn("PostgreSQL unavailable; continuing with in-memory simulation.", error.message));
simulator.start();
httpServer.listen(config.port, () => console.log(`IoT API listening on http://localhost:${config.port}`));
const shutdown = async () => { simulator.stop(); await closeDatabase(); io.close(); httpServer.close(() => process.exit(0)); };
process.on("SIGINT", shutdown); process.on("SIGTERM", shutdown);

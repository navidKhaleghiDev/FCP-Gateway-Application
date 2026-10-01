import cors from "cors";
import express from "express";
import { z } from "zod";
import type { Simulator } from "./simulator.js";
import { errorHandler, HttpError } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

const eventSchema = z.object({ eventType: z.enum(["urgent_alarm", "technical_fault", "power_failure", "disconnect", "reconnect", "resolve_alarm"]) });

const deviceListSchema = z.object({
  search: z.string().max(200).default(""),
  filter: z.enum(["all", "online", "urgent", "faults", "attention"]).default("all"),
  status: z.enum(["all", "online", "offline"]).default("all"),
  priority: z.enum(["all", "normal", "warning", "urgent"]).default("all"),
});
const alertListSchema = z.object({
  search: z.string().max(200).default(""),
  deviceId: z.string().max(100).default(""),
  status: z.enum(["all", "active", "resolved"]).default("all"),
  kind: z.enum(["all", "urgent_alarm", "technical_fault", "power_failure"]).default("all"),
  priority: z.enum(["all", "warning", "urgent"]).default("all"),
});

export function createApp(simulator: Simulator, clientUrl = "http://localhost:5173") {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: clientUrl, credentials: false }));
  app.use(express.json({ limit: "100kb" }));
  app.get("/api/health", (_req,res) => res.json({ data: { status: "ok" } }));
  app.get("/api/devices", (req,res,next) => {
    const parsed = deviceListSchema.safeParse(req.query);
    if (!parsed.success) return next(new HttpError(400, "Invalid device query", parsed.error.flatten()));
    const { search, filter, status, priority } = parsed.data;
    const q = search.trim().toLocaleLowerCase();
    const rows = simulator.list().filter((device) =>
      (!q || `${device.name} ${device.id} ${device.buildingName}`.toLocaleLowerCase().includes(q)) &&
      (status === "all" || device.status === status) &&
      (priority === "all" || device.priority === priority) &&
      (filter === "all" ||
        (filter === "online" && device.status === "online") ||
        (filter === "urgent" && device.urgentAlarm) ||
        (filter === "faults" && (device.hasFaults || !device.acPower)) ||
        (filter === "attention" && (device.priority !== "normal" || device.hasFaults || !device.acPower)))
    ).sort((a,b) => b.lastSeen.localeCompare(a.lastSeen) || a.id.localeCompare(b.id));
    res.json({ data: rows, meta: { summary: simulator.summary() } });
  });
  app.get("/api/devices/:id", (req,res, next) => { const device=simulator.get(req.params.id); if(!device) return next(new HttpError(404, "Device not found")); res.json({data:device}); });
  app.get("/api/dashboard/summary", (_req,res) => res.json({ data: simulator.summary() }));
  app.get("/api/alerts", (req,res,next) => {
    const parsed = alertListSchema.safeParse(req.query);
    if (!parsed.success) return next(new HttpError(400, "Invalid alert query", parsed.error.flatten()));
    const { search, deviceId, status, kind, priority } = parsed.data;
    const q = search.trim().toLocaleLowerCase();
    const rows = simulator.activeAlerts().filter((alert) =>
      (!q || `${alert.id} ${alert.deviceId} ${alert.message}`.toLocaleLowerCase().includes(q)) &&
      (!deviceId || alert.deviceId === deviceId) &&
      (status === "all" || (status === "active" ? !alert.resolvedAt : !!alert.resolvedAt)) &&
      (kind === "all" || alert.kind === kind) &&
      (priority === "all" || alert.priority === priority)
    );
    res.json({ data: rows });
  });
  app.post("/api/devices/:id/simulate", (req,res, next) => { const parsed=eventSchema.safeParse(req.body); if(!parsed.success) return next(new HttpError(400, "Invalid eventType", parsed.error.flatten())); const device=simulator.simulate(req.params.id,parsed.data.eventType); if(!device) return next(new HttpError(404, "Device not found")); res.json({data:device}); });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

import cors from "cors";
import express from "express";
import { z } from "zod";
import type { Simulator } from "./simulator.js";
import { errorHandler, HttpError } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

const eventSchema = z.object({ eventType: z.enum(["urgent_alarm", "technical_fault", "power_failure", "disconnect", "reconnect", "resolve_alarm"]) });
export function createApp(simulator: Simulator, clientUrl = "http://localhost:5173") {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: clientUrl, credentials: false }));
  app.use(express.json({ limit: "100kb" }));
  app.get("/api/health", (_req,res) => res.json({ data: { status: "ok" } }));
  app.get("/api/devices", (_req,res) => res.json({ data: simulator.list() }));
  app.get("/api/devices/:id", (req,res, next) => { const device=simulator.get(req.params.id); if(!device) return next(new HttpError(404, "Device not found")); res.json({data:device}); });
  app.get("/api/dashboard/summary", (_req,res) => res.json({ data: simulator.summary() }));
  app.get("/api/alerts", (_req,res) => res.json({ data: simulator.activeAlerts() }));
  app.post("/api/devices/:id/simulate", (req,res, next) => { const parsed=eventSchema.safeParse(req.body); if(!parsed.success) return next(new HttpError(400, "Invalid eventType", parsed.error.flatten())); const device=simulator.simulate(req.params.id,parsed.data.eventType); if(!device) return next(new HttpError(404, "Device not found")); res.json({data:device}); });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

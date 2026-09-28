import cors from "cors";
import express from "express";
import { z } from "zod";
import type { Simulator } from "./simulator.js";

const eventSchema = z.object({ eventType: z.enum(["urgent_alarm", "technical_fault", "power_failure", "disconnect", "reconnect", "resolve_alarm"]) });
export function createApp(simulator: Simulator, clientUrl = "http://localhost:5173") {
  const app = express(); app.use(cors({ origin: clientUrl })); app.use(express.json());
  app.get("/api/health", (_req,res) => res.json({ data: { status: "ok" } }));
  app.get("/api/devices", (_req,res) => res.json({ data: simulator.list() }));
  app.get("/api/devices/:id", (req,res) => { const device=simulator.get(req.params.id); if(!device) return res.status(404).json({ error:"Device not found" }); res.json({data:device}); });
  app.get("/api/dashboard/summary", (_req,res) => res.json({ data: simulator.summary() }));
  app.get("/api/alerts", (_req,res) => res.json({ data: simulator.activeAlerts() }));
  app.post("/api/devices/:id/simulate", (req,res) => { const parsed=eventSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({error:"Invalid eventType",details:parsed.error.flatten()}); const device=simulator.simulate(req.params.id,parsed.data.eventType); if(!device) return res.status(404).json({error:"Device not found"}); res.json({data:device}); });
  app.use((_req,res) => res.status(404).json({error:"Route not found"}));
  return app;
}

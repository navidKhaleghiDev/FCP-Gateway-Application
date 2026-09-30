import type {
  Alert,
  AlertKind,
  DashboardSummary,
  Device,
  EventType,
  ServerEvent,
} from "./types.js";
import type { Server } from "socket.io";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const drift = (value: number, range: number) =>
  value + (Math.random() * 2 - 1) * range;
const now = () => new Date().toISOString();

export class Simulator {
  readonly devices = new Map<string, Device>();
  readonly alerts = new Map<string, Alert>();
  private timer?: NodeJS.Timeout;
  private alertSequence = 1000;

  constructor(
    private io?: Server,
    count = 120,
  ) {
    const center = { lat: 35.7219, lng: 51.3347 };
    for (let i = 1; i <= count; i++) {
      const id = `GW-${String(i).padStart(4, "0")}`;
      this.devices.set(id, {
        id,
        name: `درگاه ${new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 3, useGrouping: false }).format(i)}`,
        buildingId: `BLD-${String(((i - 1) % 24) + 1).padStart(3, "0")}`,
        buildingName: `ساختمان ${["اطلس", "نشان", "آزادی", "مهر", "سینا", "آریا"][i % 6]} ${new Intl.NumberFormat("fa-IR").format(((i - 1) % 24) + 1)}`,
        status: "online",
        priority: "normal",
        battery: 72 + Math.round(Math.random() * 27),
        signalStrength: -45 - Math.round(Math.random() * 35),
        temperature: 19 + Math.random() * 9,
        acPower: true,
        hasFaults: false,
        urgentAlarm: false,
        lastSeen: now(),
        latitude: center.lat + (Math.random() - 0.5) * 0.19,
        longitude: center.lng + (Math.random() - 0.5) * 0.28,
        version: 1,
      });
    }
  }

  setIo(io: Server) {
    this.io = io;
  }
  list() {
    return [...this.devices.values()];
  }
  get(id: string) {
    return this.devices.get(id);
  }
  activeAlerts() {
    return [...this.alerts.values()].sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
    );
  }
  summary(): DashboardSummary {
    const all = this.list();
    return {
      total: all.length,
      online: all.filter((d) => d.status === "online").length,
      offline: all.filter((d) => d.status === "offline").length,
      urgent: all.filter((d) => d.urgentAlarm).length,
      faults: all.filter((d) => d.hasFaults).length,
    };
  }

  start() {
    this.schedule();
  }
  stop() {
    if (this.timer) clearTimeout(this.timer);
  }
  private schedule() {
    this.timer = setTimeout(
      () => {
        this.tick();
        this.schedule();
      },
      1000 + Math.random() * 2000,
    );
  }
  private emit(event: ServerEvent["event"], data: Device | Alert) {
    this.io?.emit(event, data);
  }

  private tick() {
    const online = this.list().filter((d) => d.status === "online");
    const sample = online
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(4, Math.ceil(online.length * 0.08)));
    for (const current of sample) {
      const next: Device = {
        ...current,
        battery: clamp(drift(current.battery, 0.35), 0, 100),
        signalStrength: Math.round(
          clamp(drift(current.signalStrength, 2), -100, -30),
        ),
        temperature: clamp(drift(current.temperature, 0.25), -5, 65),
        lastSeen: now(),
        version: current.version + 1,
      };
      this.devices.set(next.id, next);
      this.emit("device:updated", next);
    }
    if (Math.random() < 0.12 && online.length) {
      const target = online[Math.floor(Math.random() * online.length)];
      const events: EventType[] = [
        "technical_fault",
        "power_failure",
        "disconnect",
        "urgent_alarm",
      ];
      this.simulate(
        target.id,
        events[Math.floor(Math.random() * events.length)],
      );
    }
  }

  simulate(id: string, eventType: EventType) {
    const current = this.devices.get(id);
    if (!current) return null;
    let next = { ...current, version: current.version + 1, lastSeen: now() };
    if (eventType === "disconnect")
      next = { ...next, status: "offline", priority: "warning" };
    if (eventType === "reconnect")
      next = {
        ...next,
        status: "online",
        priority: next.urgentAlarm
          ? "urgent"
          : next.hasFaults || !next.acPower
            ? "warning"
            : "normal",
      };
    if (eventType === "urgent_alarm")
      next = { ...next, urgentAlarm: true, priority: "urgent" };
    if (eventType === "technical_fault")
      next = {
        ...next,
        hasFaults: true,
        priority: next.urgentAlarm ? "urgent" : "warning",
      };
    if (eventType === "power_failure")
      next = {
        ...next,
        acPower: false,
        priority: next.urgentAlarm ? "urgent" : "warning",
      };
    if (eventType === "resolve_alarm") {
      next = {
        ...next,
        urgentAlarm: false,
        hasFaults: false,
        acPower: true,
        priority: next.status === "offline" ? "warning" : "normal",
      };
      for (const alert of this.alerts.values())
        if (alert.deviceId === id && !alert.resolvedAt) {
          const resolved = { ...alert, resolvedAt: now() };
          this.alerts.set(alert.id, resolved);
          this.emit("alert:resolved", resolved);
        }
    }
    this.devices.set(id, next);
    const deviceEvent =
      eventType === "disconnect"
        ? "device:disconnected"
        : eventType === "reconnect"
          ? "device:connected"
          : "device:updated";
    this.emit(deviceEvent, next);
    const kind = eventType as AlertKind;
    if (
      ["urgent_alarm", "technical_fault", "power_failure"].includes(eventType)
    ) {
      const labels: Record<AlertKind, string> = {
        urgent_alarm: "هشدار حریق فعال شد",
        technical_fault: "خطای فنی شناسایی شد",
        power_failure: "برق شهری قطع شد",
      };
      const alert: Alert = {
        id: `ALT-${++this.alertSequence}`,
        deviceId: id,
        kind,
        priority: eventType === "urgent_alarm" ? "urgent" : "warning",
        message: labels[kind],
        timestamp: now(),
        resolvedAt: null,
      };
      this.alerts.set(alert.id, alert);
      this.emit("alert:created", alert);
    }
    return next;
  }
}

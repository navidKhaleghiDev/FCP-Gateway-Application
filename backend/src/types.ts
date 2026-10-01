export type DeviceStatus = "online" | "offline";
export type DevicePriority = "normal" | "warning" | "urgent";
export type EventType = "urgent_alarm" | "technical_fault" | "power_failure" | "disconnect" | "reconnect" | "resolve_alarm";
export type AlertKind = "urgent_alarm" | "technical_fault" | "power_failure";

export interface Device {
  id: string; name: string; buildingId: string; buildingName: string;
  status: DeviceStatus; priority: DevicePriority; battery: number;
  signalStrength: number; temperature: number; acPower: boolean;
  hasFaults: boolean; urgentAlarm: boolean; lastSeen: string;
  latitude: number; longitude: number; version: number;
}

export interface Alert {
  id: string; deviceId: string; kind: AlertKind; priority: Exclude<DevicePriority, "normal">;
  message: string; timestamp: string; resolvedAt: string | null;
}

export interface DashboardSummary {
  total: number; online: number; offline: number; urgent: number; faults: number;
  warnings: number; errors: number;
}

export interface TelemetryPoint { timestamp: string; temperature: number; battery: number; signalStrength: number }
export interface ApiResponse<T> { data: T }

export type ServerEvent =
  | { event: "device:updated" | "device:disconnected" | "device:connected"; data: Device }
  | { event: "alert:created" | "alert:resolved"; data: Alert };

export const SOCKET_EVENTS = ["device:updated", "device:disconnected", "device:connected", "alert:created", "alert:resolved"] as const;

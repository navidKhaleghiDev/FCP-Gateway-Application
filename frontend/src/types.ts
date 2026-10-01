export type DeviceStatus = 'online' | 'offline';
export type DevicePriority = 'normal' | 'warning' | 'urgent';
export type EventType =
  | 'urgent_alarm'
  | 'technical_fault'
  | 'power_failure'
  | 'disconnect'
  | 'reconnect'
  | 'resolve_alarm';
export type AlertKind = 'urgent_alarm' | 'technical_fault' | 'power_failure';

export interface Device {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  status: DeviceStatus;
  priority: DevicePriority;
  battery: number;
  signalStrength: number;
  temperature: number;
  acPower: boolean;
  hasFaults: boolean;
  urgentAlarm: boolean;
  lastSeen: string;
  latitude: number;
  longitude: number;
  version: number;
}

export interface Alert {
  id: string;
  deviceId: string;
  kind: AlertKind;
  priority: Exclude<DevicePriority, 'normal'>;
  message: string;
  timestamp: string;
  resolvedAt: string | null;
}

export interface DashboardSummary {
  total: number;
  online: number;
  offline: number;
  urgent: number;
  faults: number;
  warnings: number;
  errors: number;
}

export interface TelemetryPoint {
  timestamp: string;
  temperature: number;
  battery: number;
  signalStrength: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface DeviceListResponse {
  data: Device[];
  meta: { summary: DashboardSummary };
}

export type ServerEvent =
  | { event: 'device:updated' | 'device:disconnected' | 'device:connected'; data: Device }
  | { event: 'alert:created' | 'alert:resolved'; data: Alert };

export const SOCKET_EVENTS = [
  'device:updated',
  'device:disconnected',
  'device:connected',
  'alert:created',
  'alert:resolved',
] as const;

export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'offline';
export interface DeviceState {
  devices: Record<string, Device>;
  latestAlert: Alert | null;
  alertsOpen: boolean;
  alertsOpenSession: number;
  connection: ConnectionState;
  selectedId: string | null;
  hydrate: (devices: Device[]) => void;
  upsertDevice: (device: Device) => void;
  setLatestAlert: (alert: Alert) => void;
  openAlerts: () => void;
  closeAlerts: () => void;
  setConnection: (state: ConnectionState) => void;
  select: (id: string | null) => void;
}

export interface DeviceListParams {
  search?: string;
  filter?: 'all' | 'online' | 'urgent' | 'faults' | 'attention';
  status?: 'all' | 'online' | 'offline';
  priority?: 'all' | 'normal' | 'warning' | 'urgent';
}
export interface AlertListParams {
  search?: string;
  deviceId?: string;
  status?: 'all' | 'active' | 'resolved';
  kind?: 'all' | 'urgent_alarm' | 'technical_fault' | 'power_failure';
  priority?: 'all' | 'warning' | 'urgent';
}

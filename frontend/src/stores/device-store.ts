import { create } from 'zustand';
import type { Alert, Device } from '@sentinel/shared';
type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'offline';
interface DeviceState {
  devices: Record<string, Device>;
  alerts: Record<string, Alert>;
  connection: ConnectionState;
  selectedId: string | null;
  hydrate: (devices: Device[], alerts?: Alert[]) => void;
  upsertDevice: (device: Device) => void;
  upsertAlert: (alert: Alert) => void;
  setConnection: (state: ConnectionState) => void;
  select: (id: string | null) => void;
}
export const useDeviceStore = create<DeviceState>((set) => ({
  devices: {},
  alerts: {},
  connection: 'connecting',
  selectedId: null,
  hydrate: (devices, alerts = []) =>
    set({
      devices: Object.fromEntries(devices.map((d) => [d.id, d])),
      alerts: Object.fromEntries(alerts.map((a) => [a.id, a])),
    }),
  upsertDevice: (incoming) =>
    set((s) => {
      const current = s.devices[incoming.id];
      if (current && current.version >= incoming.version) return s;
      return { devices: { ...s.devices, [incoming.id]: incoming } };
    }),
  upsertAlert: (alert) => set((s) => ({ alerts: { ...s.alerts, [alert.id]: alert } })),
  setConnection: (connection) => set({ connection }),
  select: (selectedId) => set({ selectedId }),
}));
export const selectDevices = (s: DeviceState) => Object.values(s.devices);
export const selectAlerts = (s: DeviceState) =>
  Object.values(s.alerts).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

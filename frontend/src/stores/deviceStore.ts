import { create } from 'zustand';
import type { DeviceState } from '@/types';


/** Stores live devices, connection state, and alert panel state. */
export const useDeviceStore = create<DeviceState>((set) => ({
  devices: {},
  latestAlert: null,
  alertsOpen: false,
  alertsOpenSession: 0,
  connection: 'connecting',
  selectedId: null,
  /** Merges REST results without replacing newer WebSocket versions. */
  hydrate: (devices) =>
    set((state) => {
      const nextDevices = { ...state.devices };
      for (const device of devices) {
        if (!nextDevices[device.id] || nextDevices[device.id].version <= device.version) {
          nextDevices[device.id] = device;
        }
      }
      return { devices: nextDevices };
    }),
  /** Applies a device event only when its version is newer. */
  upsertDevice: (incoming) =>
    set((s) => {
      const current = s.devices[incoming.id];
      if (current && current.version >= incoming.version) return s;
      return { devices: { ...s.devices, [incoming.id]: incoming } };
    }),
  /** Keeps the newest alert for the global indicator. */
  setLatestAlert: (alert) => set((state) => {
    if (state.latestAlert?.id === alert.id) return { latestAlert: alert };
    if (!state.latestAlert || alert.timestamp >= state.latestAlert.timestamp) return { latestAlert: alert };
    return state;
  }),
  /** Opens the alert panel and starts a fresh query session. */
  openAlerts: () => set((state) => ({ alertsOpen: true, alertsOpenSession: state.alertsOpenSession + 1 })),
  /** Closes the alert panel. */
  closeAlerts: () => set({ alertsOpen: false }),
  /** Updates the connection indicator. */
  setConnection: (connection) => set({ connection }),
  /** Selects a map device, including from a toast callback. */
  select: (selectedId) => set({ selectedId }),
}));


export const selectDevices = (s: DeviceState) => Object.values(s.devices);

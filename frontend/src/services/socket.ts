import { toast } from 'sonner';
import type { Alert, Device, ServerEvent } from '@/types';
import {
  invalidateAlertQueries,
  invalidateGatewayQueries,
} from '@/services/queryClient';
import { useDeviceStore } from '@/stores/deviceStore';

function isServerEvent(value: unknown): value is ServerEvent {
  if (!value || typeof value !== 'object') return false;
  const message = value as { event?: unknown; data?: unknown };
  if (!message.data || typeof message.data !== 'object') return false;
  const data = message.data as Record<string, unknown>;
  if (typeof data.id !== 'string') return false;
  if (
    ['device:updated', 'device:disconnected', 'device:connected'].includes(String(message.event))
  ) {
    return typeof data.version === 'number';
  }
  if (['alert:created', 'alert:resolved'].includes(String(message.event))) {
    return typeof data.deviceId === 'string' && typeof data.timestamp === 'string';
  }
  return false;
}

let gatewayRefresh: ReturnType<typeof setTimeout> | undefined;
let alertRefresh: ReturnType<typeof setTimeout> | undefined;
function scheduleGatewayRefresh() {
  if (gatewayRefresh) clearTimeout(gatewayRefresh);
  gatewayRefresh = setTimeout(invalidateGatewayQueries, 350);
}
function scheduleAlertRefresh() {
  if (alertRefresh) clearTimeout(alertRefresh);
  alertRefresh = setTimeout(invalidateAlertQueries, 350);
}
function gatewayStateChanged(previous: Device | undefined, incoming: Device) {
  return (
    !previous ||
    previous.status !== incoming.status ||
    previous.priority !== incoming.priority ||
    previous.hasFaults !== incoming.hasFaults ||
    previous.acPower !== incoming.acPower ||
    previous.urgentAlarm !== incoming.urgentAlarm
  );
}

function handleEvent(message: ServerEvent) {
  const store = useDeviceStore.getState();
  if (message.event.startsWith('device:')) {
    const incoming = message.data as Device;
    const previous = store.devices[incoming.id];
    if (previous && previous.version >= incoming.version) return;
    store.upsertDevice(incoming);
    if (gatewayStateChanged(previous, incoming)) scheduleGatewayRefresh();
    return;
  }
  const alert = message.data as Alert;
  scheduleAlertRefresh();
  if (message.event === 'alert:created' || store.latestAlert?.id === alert.id) {
    store.setLatestAlert(alert);
  }
  if (message.event === 'alert:created') {
    toast[alert.priority === 'urgent' ? 'error' : 'warning'](alert.message, {
      description: `${alert.deviceId} · مشاهده روی نقشه`,
      action: {
        label: 'مشاهده',
        onClick: () => useDeviceStore.getState().select(alert.deviceId),
      },
    });
  }
}

/** Validates and applies a socket payload without interrupting later events. */
export function handleSocketMessage(raw: unknown) {
  try {
    const message: unknown = JSON.parse(String(raw));
    if (isServerEvent(message)) handleEvent(message);
  } catch {
    // Ignore malformed messages; the next valid event can still be processed.
  }
}

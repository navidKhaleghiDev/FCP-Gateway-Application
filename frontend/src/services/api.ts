import type { Alert, ApiResponse, Device, DeviceListResponse, EventType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { API_ENDPOINTS } from '@/services/endpoints';

export { http, http as api } from '@/services/http';

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

export const DEVICES_KEY = 'devices';
export const ALERTS_KEY = 'alerts';

/** Queries a device list with its filters included in the cache key. */
export function useGetDevices(
  params: DeviceListParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: [DEVICES_KEY, params],
    queryFn: async (): Promise<DeviceListResponse> =>
      (await http.get<DeviceListResponse>(API_ENDPOINTS.devices, { params })).data,
    enabled: options.enabled,
  });
}

/** Queries alerts for the panel or for a selected device. */
export function useGetAlerts(
  params: AlertListParams = {},
  options: { enabled?: boolean; session?: number } = {}
) {
  return useQuery({
    queryKey: [ALERTS_KEY, options.session ?? 0, params],
    queryFn: async (): Promise<Alert[]> =>
      (await http.get<ApiResponse<Alert[]>>(API_ENDPOINTS.alerts, { params })).data.data,
    enabled: options.enabled,
  });
}

/** Imperative requests used outside React Query. */
export const deviceApi = {
  detail: (id: string) =>
    http.get<ApiResponse<Device>>(API_ENDPOINTS.device(id)).then((response) => response.data.data),
  simulate: (id: string, eventType: EventType) =>
    http
      .post<ApiResponse<Device>>(API_ENDPOINTS.simulate(id), { eventType })
      .then((response) => response.data.data),
};

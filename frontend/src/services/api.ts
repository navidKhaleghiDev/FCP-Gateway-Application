import { useMemo } from 'react';
import type {
  Alert,
  AlertListParams,
  ApiResponse,
  Device,
  DeviceListParams,
  DeviceListResponse,
  EventType,
} from '@/types';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services/http';
import { E_ALERTS, E_DEVICES, E_DEVICES_BY_ID, E_SIMULATE } from '@/services/endpoints';

export { http, http as api } from '@/services/http';

export const DEVICES_KEY = 'devices';
export const ALERTS_KEY = 'alerts';

/** Queries a device list with its filters included in the cache key. */
export function useGetDevices(params: DeviceListParams = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: [DEVICES_KEY, params],
    queryFn: async (): Promise<DeviceListResponse> =>
      (await http.get<DeviceListResponse>(E_DEVICES, { params })).data,
    enabled: options.enabled,
  });
}

/** Queries alerts for the panel or for a selected device. */
export function useGetAlerts(
  params: AlertListParams = {},
  options: { enabled?: boolean; session?: number } = {}
) {
  const query = useQuery({
    queryKey: [ALERTS_KEY, options.session ?? 0, params],
    queryFn: async (): Promise<Alert[]> =>
      (await http.get<ApiResponse<Alert[]>>(E_ALERTS, { params })).data.data,
    enabled: options.enabled,
  });
  const activeCount = useMemo(
    () => query.data?.filter((alert) => !alert.resolvedAt).length ?? 0,
    [query.data]
  );
  return { ...query, activeCount };
}

/** Imperative requests used outside React Query. */
export const deviceApi = {
  detail: (id: string) =>
    http.get<ApiResponse<Device>>(E_DEVICES_BY_ID(id)).then((response) => response.data.data),
  simulate: (id: string, eventType: EventType) =>
    http
      .post<ApiResponse<Device>>(E_SIMULATE(id), { eventType })
      .then((response) => response.data.data),
};

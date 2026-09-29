import type { Alert, ApiResponse, DashboardSummary, Device, EventType } from '@sentinel/shared';
import { http } from '@/services/http';

export { http as api } from '@/services/http';

export const deviceApi = {
  list: () => http.get<ApiResponse<Device[]>>('/api/devices').then((response) => response.data.data),
  detail: (id: string) => http.get<ApiResponse<Device>>(`/api/devices/${id}`).then((response) => response.data.data),
  summary: () => http.get<ApiResponse<DashboardSummary>>('/api/dashboard/summary').then((response) => response.data.data),
  alerts: () => http.get<ApiResponse<Alert[]>>('/api/alerts').then((response) => response.data.data),
  simulate: (id: string, eventType: EventType) =>
    http.post<ApiResponse<Device>>(`/api/devices/${id}/simulate`, { eventType }).then((response) => response.data.data),
};

export const deviceQueryOptions = {
  devices: { queryKey: ['devices'] as const, queryFn: deviceApi.list },
  alerts: { queryKey: ['alerts'] as const, queryFn: deviceApi.alerts },
};

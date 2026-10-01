/** REST paths shared by device and alert requests. */
export const API_ENDPOINTS = {
  devices: '/api/devices',
  device: (id: string) => '/api/devices/' + encodeURIComponent(id),
  alerts: '/api/alerts',
  simulate: (id: string) => '/api/devices/' + encodeURIComponent(id) + '/simulate',
} as const;

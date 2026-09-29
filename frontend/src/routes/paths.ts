export const ROUTES = {
  HOME: '/',
  DEVICES: '/devices',
  DEVICE_DETAILS: '/devices/:id',
  ALERTS: '/alerts',
} as const;

export const deviceDetailsPath = (id: string) =>
  ROUTES.DEVICE_DETAILS.replace(':id', encodeURIComponent(id));

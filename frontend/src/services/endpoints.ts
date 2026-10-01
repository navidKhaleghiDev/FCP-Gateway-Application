export const E_DEVICES = '/api/devices';
export const E_DEVICES_BY_ID = (id: string) => `/api/devices/'${encodeURIComponent(id)}`;
export const E_ALERTS = '/api/alerts';
export const E_SIMULATE = (id: string) => `/api/devices/${encodeURIComponent(id)}/simulate`;

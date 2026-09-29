export const SERVICE_CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  socketUrl: import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000',
  requestTimeoutMs: 8_000,
} as const;

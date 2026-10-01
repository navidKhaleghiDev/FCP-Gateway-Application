export const SERVICE_CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  socketUrl: new URL('/ws', import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:4000')
    .toString().replace(/^http/, 'ws'),
  requestTimeoutMs: 8_000,
  socketReconnectAttempts: Infinity,
  socketReconnectBaseMs: 800,
  socketReconnectMaxMs: 5_000,
} as const;

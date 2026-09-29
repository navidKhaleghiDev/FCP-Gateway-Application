export const APP_CONFIG = {
  devicesPageSize: 15,
  searchDebounceMs: 300,
  query: {
    staleTime: 30_000,
    retry: 2,
  },
} as const;

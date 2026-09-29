import { QueryClient } from '@tanstack/react-query';
import { APP_CONFIG } from '@/config/app';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.query.staleTime,
      refetchOnWindowFocus: false,
      retry: APP_CONFIG.query.retry,
    },
  },
});

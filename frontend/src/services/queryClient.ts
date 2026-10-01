import { QueryClient } from '@tanstack/react-query';
import { APP_CONFIG } from '@/config/app';
import { ALERTS_KEY, DEVICES_KEY } from '@/services/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.query.staleTime,
      refetchOnWindowFocus: false,
      retry: APP_CONFIG.query.retry,
    },
  },
});

/** Refetch mounted device views; each device response includes fresh summary metadata. */
export function invalidateGatewayQueries() {
  void queryClient.invalidateQueries({ queryKey: [DEVICES_KEY], refetchType: 'active' });
}

/** Disabled or unmounted alert views remain idle until the user opens them. */
export function invalidateAlertQueries() {
  void queryClient.invalidateQueries({ queryKey: [ALERTS_KEY], refetchType: 'active' });
}

export function invalidateLiveQueries() {
  invalidateGatewayQueries();
  invalidateAlertQueries();
}

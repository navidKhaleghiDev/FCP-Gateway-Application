import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { deviceQueryOptions } from '@/services/api';
import { connectSocket } from '@/services/socket';
import { useDeviceStore } from '@/stores/device-store';

/**
 * Loads the live device and alert collections and keeps the device store synchronized.
 * It also establishes the real-time socket connection for updates.
 *
 * @returns {{isLoading: boolean, isError: boolean, error: Error|null, refetch: Function}}
 * Query state and a function for retrying the device request.
 */
export function useLiveData() {
  const hydrate = useDeviceStore((s) => s.hydrate);
  const devices = useQuery({
    ...deviceQueryOptions.devices,
    retry: 2,
  });
  const alerts = useQuery({
    ...deviceQueryOptions.alerts,
    retry: 2,
  });
  useEffect(() => {
    if (devices.data) hydrate(devices.data, alerts.data);
  }, [devices.data, alerts.data, hydrate]);
  useEffect(() => connectSocket(), []);
  return {
    isLoading: devices.isLoading,
    isError: devices.isError,
    error: devices.error,
    refetch: devices.refetch,
  };
}

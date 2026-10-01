import { useEffect } from 'react';
import { useGetDevices } from '@/services/api';
import { useDeviceStore } from '@/stores/deviceStore';

/**
 * Loads the live device collection and keeps the device store synchronized.
 *
 * @returns {{isLoading: boolean, isError: boolean, error: Error|null, refetch: Function}}
 * Query state and a function for retrying the device request.
 */
export function useLiveData() {
  const hydrate = useDeviceStore((s) => s.hydrate);
  const devices = useGetDevices();
  useEffect(() => {
    if (devices.data) hydrate(devices.data.data);
  }, [devices.data, hydrate]);
  return {
    data: devices.data,
    isLoading: devices.isLoading,
    isError: devices.isError,
    error: devices.error,
    refetch: devices.refetch,
  };
}

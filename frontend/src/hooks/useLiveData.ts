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
  const {
    hydrate,
    devices: deviceRecord,
    select: selectDevice,
    selectedId,
  } = useDeviceStore((s) => s);
  const { data, isLoading, refetch, isError, error } = useGetDevices();

  useEffect(() => {
    if (data) hydrate(data.data);
  }, [data, hydrate]);

  return {
    data,
    isLoading,
    deviceRecord,
    selectDevice,
    selectedId,
    isError,
    error,
    refetch,
  };
}

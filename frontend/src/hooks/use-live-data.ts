import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { deviceApi } from "@/lib/api";
import { connectSocket } from "@/services/socket";
import { useDeviceStore } from "@/stores/device-store";
export function useLiveData() {
  const hydrate = useDeviceStore((s) => s.hydrate);
  const devices = useQuery({
    queryKey: ["devices"],
    queryFn: deviceApi.list,
    retry: 2,
  });
  const alerts = useQuery({
    queryKey: ["alerts"],
    queryFn: deviceApi.alerts,
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

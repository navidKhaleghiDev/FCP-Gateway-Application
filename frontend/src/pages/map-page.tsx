import { useMemo, useState } from "react";
import { AlertTriangle, RadioTower, ShieldAlert, Wifi } from "lucide-react";
import { DeviceMap } from "@/components/organisms/device-map";
import { DevicePanel } from "@/components/organisms/device-panel";
import { KpiCard } from "@/components/molecules/kpi-card";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { Button } from "@/components/atoms/button";
import { fa, faNumber } from "@/lib/i18n";
export function MapPage() {
  const { isLoading, isError, refetch } = useLiveData();
  const deviceRecord = useDeviceStore((state) => state.devices);
  const devices = useMemo(() => Object.values(deviceRecord), [deviceRecord]);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return devices.filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.buildingName.toLowerCase().includes(q),
    );
  }, [devices, search]);
  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    urgent: devices.filter((d) => d.urgentAlarm).length,
    faults: devices.filter((d) => d.hasFaults || !d.acPower).length,
  };
  if (isError)
    return (
      <div className="grid h-screen place-items-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-3 text-red-500" />
          <h2>{fa.map.loadError}</h2>
          <Button onClick={() => refetch()}>{fa.common.retry}</Button>
        </div>
      </div>
    );
  return (
    <main className="relative h-screen overflow-hidden">
      <DeviceMap devices={filtered} />
      <DevicePanel devices={filtered} search={search} setSearch={setSearch} />
      <div className="fixed bottom-4 left-4 z-[900] hidden gap-3 xl:flex">
        <KpiCard
          label={fa.kpi.total}
          value={stats.total}
          icon={RadioTower}
          tone="bg-teal-50 text-teal-600"
          caption={fa.kpi.totalHint}
        />
        <KpiCard
          label={fa.kpi.online}
          value={stats.online}
          icon={Wifi}
          tone="bg-teal-50 text-teal-600"
          caption={`${faNumber(stats.total ? Math.round((stats.online / stats.total) * 100) : 0)}٪ ${fa.kpi.availability}`}
        />
        <KpiCard
          label={fa.kpi.urgent}
          value={stats.urgent}
          icon={ShieldAlert}
          tone="bg-red-100 text-red-600"
          caption={fa.kpi.urgentHint}
        />
        <KpiCard
          label={fa.kpi.faults}
          value={stats.faults}
          icon={AlertTriangle}
          tone="bg-amber-100 text-amber-600"
          caption={fa.kpi.faultsHint}
        />
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-[2000] grid place-items-center bg-gray-100/70 backdrop-blur-sm">
          <div className="glass rounded-lg px-5 py-4 text-sm text-teal-600">
            {fa.map.loading}
          </div>
        </div>
      )}
    </main>
  );
}

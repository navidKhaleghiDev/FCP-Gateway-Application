import { useMemo, useState } from "react";
import { AlertTriangle, RadioTower, ShieldAlert, Wifi } from "lucide-react";
import { DeviceMap } from "@/components/organisms/device-map";
import { DevicePanel } from "@/components/organisms/device-panel";
import { KpiCard } from "@/components/molecules/kpi-card";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { Button } from "@/components/atoms/button";
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
          <AlertTriangle className="mx-auto mb-3 text-rose-400" />
          <h2>Could not load gateway data</h2>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    );
  return (
    <main className="relative h-screen overflow-hidden">
      <DeviceMap devices={filtered} />
      <DevicePanel devices={filtered} search={search} setSearch={setSearch} />
      <div className="fixed bottom-4 right-4 z-[900] hidden gap-3 xl:flex">
        <KpiCard
          label="Total gateways"
          value={stats.total}
          icon={RadioTower}
          tone="bg-cyan-400/12 text-cyan-300"
          caption="Across 24 buildings"
        />
        <KpiCard
          label="Online now"
          value={stats.online}
          icon={Wifi}
          tone="bg-emerald-400/12 text-emerald-300"
          caption={`${stats.total ? Math.round((stats.online / stats.total) * 100) : 0}% availability`}
        />
        <KpiCard
          label="Urgent alarms"
          value={stats.urgent}
          icon={ShieldAlert}
          tone="bg-rose-400/12 text-rose-300"
          caption="Requires response"
        />
        <KpiCard
          label="Technical faults"
          value={stats.faults}
          icon={AlertTriangle}
          tone="bg-amber-400/12 text-amber-300"
          caption="Under investigation"
        />
      </div>
      {isLoading && (
        <div className="fixed inset-0 z-[2000] grid place-items-center bg-slate-950/45 backdrop-blur-sm">
          <div className="glass rounded-2xl px-5 py-4 text-sm text-cyan-300">
            Connecting to gateway network…
          </div>
        </div>
      )}
    </main>
  );
}

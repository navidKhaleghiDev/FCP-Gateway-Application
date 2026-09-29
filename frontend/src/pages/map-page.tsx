import { useMemo } from 'react';
import { AlertTriangle, RadioTower, ShieldAlert, Wifi } from 'lucide-react';
import { DeviceMap } from '@/components/organisms/device-map';
import { DevicePanel } from '@/components/organisms/device-panel';
import { KpiCard } from '@/components/molecules/kpi-card';
import { useDeviceStore } from '@/stores/device-store';
import { useLiveData } from '@/hooks/use-live-data';
import { LoadingWrapper } from '@/components/molecules/loading-wrapper';
import { fa, faNumber } from '@/lib/i18n';
import { parseAsString, useQueryStates } from 'nuqs';

const MAP_FILTER_DEFAULTS = { search: '', filter: 'all' };

export function MapPage() {
  const { isLoading, isError, refetch } = useLiveData();
  const deviceRecord = useDeviceStore((state) => state.devices);
  const devices = useMemo(() => Object.values(deviceRecord), [deviceRecord]);

  const [{ search, filter }, setUrlState] = useQueryStates(
    {
      search: parseAsString.withDefault(MAP_FILTER_DEFAULTS.search),
      filter: parseAsString.withDefault(MAP_FILTER_DEFAULTS.filter),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return devices.filter(
      (d) =>
        (filter === 'all' || d.priority !== 'normal' || d.hasFaults || !d.acPower) &&
        (!q ||
          d.name.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.buildingName.toLowerCase().includes(q))
    );
  }, [devices, filter, search]);
  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === 'online').length,
    urgent: devices.filter((d) => d.urgentAlarm).length,
    faults: devices.filter((d) => d.hasFaults || !d.acPower).length,
  };

  return (
    <LoadingWrapper isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
      <main className="relative h-screen overflow-hidden">
        <DeviceMap devices={filtered} />
        <DevicePanel
          devices={filtered}
          search={search}
          setSearch={(value) => setUrlState({ search: value })}
          filter={filter}
          setFilter={(value) => setUrlState({ filter: value })}
        />
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
      </main>
    </LoadingWrapper>
  );
}

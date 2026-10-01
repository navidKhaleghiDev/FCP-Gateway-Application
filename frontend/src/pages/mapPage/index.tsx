import { useState } from 'react';
import { parseAsString, useQueryStates } from 'nuqs';
import { AlertTriangle, RadioTower, ShieldAlert, Wifi } from 'lucide-react';

import { useGetAlerts, useGetDevices } from '@/services/api';
import type { DeviceListParams } from '@/types';
import { DeviceMap } from '@/pages/mapPage/components/deviceMap';
import { GatewayDetailsDrawer } from '@/components/organisms/gatewayDetailsDrawer';
import { useLiveData } from '@/hooks/useLiveData';
import { LoadingWrapper } from '@/components/molecules/loadingWrapper';
import { fa, faNumber } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const MAP_FILTER_DEFAULTS = { search: '', filter: 'all' };

export function MapPage() {
  const [focusRequest, setFocusRequest] = useState(0);
  const [{ search, filter }, setUrlState] = useQueryStates(
    {
      search: parseAsString.withDefault(MAP_FILTER_DEFAULTS.search),
      filter: parseAsString.withDefault(MAP_FILTER_DEFAULTS.filter),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const {
    data: liveDevices,
    deviceRecord,
    selectDevice,
    selectedId,
    isLoading,
    isError,
    refetch,
  } = useLiveData();
  const { data: selectedAlerts = [] } = useGetAlerts(
    { deviceId: selectedId ?? '' },
    { enabled: !!selectedId }
  );

  const selectedDevice = selectedId ? deviceRecord[selectedId] : undefined;

  const selectedFilter: DeviceListParams['filter'] = [
    'all',
    'online',
    'urgent',
    'faults',
    'attention',
  ].includes(filter)
    ? (filter as DeviceListParams['filter'])
    : 'all';

  const hasActiveFilter = !!search.trim() || selectedFilter !== 'all';

  const { data: filteredResult } = useGetDevices(
    { search, filter: selectedFilter },
    { enabled: hasActiveFilter }
  );
  const filtered = hasActiveFilter ? (filteredResult?.data ?? []) : (liveDevices?.data ?? []);

  const summary = liveDevices?.meta.summary;

  const stats = {
    total: summary?.total ?? 0,
    online: summary?.online ?? 0,
    urgent: summary?.urgent ?? 0,
    faults: summary?.faults ?? 0,
  };
  const badges = [
    {
      key: 'all',
      label: fa.kpi.total,
      value: stats.total,
      icon: RadioTower,
      color: 'text-teal-600',
    },
    {
      key: 'online',
      label: fa.kpi.online,
      value: stats.online,
      icon: Wifi,
      color: 'text-teal-600',
    },
    {
      key: 'urgent',
      label: fa.kpi.urgent,
      value: stats.urgent,
      icon: ShieldAlert,
      color: 'text-red-600',
    },
    {
      key: 'faults',
      label: fa.kpi.faults,
      value: stats.faults,
      icon: AlertTriangle,
      color: 'text-amber-600',
    },
  ];

  return (
    <LoadingWrapper isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
      <main className="relative h-screen overflow-hidden">
        <DeviceMap
          devices={filtered}
          focusRequest={focusRequest}
          search={{
            value: search,
            onChange: (value) => setUrlState({ search: value }),
            devices: filtered,
            selectedId,
            onSelectDevice: (id) => {
              selectDevice(id);
              setFocusRequest((request) => request + 1);
            },
          }}
          filters={
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-2" aria-label="Map filters">
              {badges.map(({ key, label, value, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setUrlState({ filter: key })}
                  aria-pressed={filter === key}
                  className={cn(
                    'flex h-9 shrink-0 items-center gap-2 rounded-full border border-white bg-white px-3 text-xs font-medium text-gray-700 shadow-md transition hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600',
                    filter === key && 'border-teal-500 bg-teal-50 text-teal-700'
                  )}
                >
                  <Icon size={15} className={color} aria-hidden="true" />
                  <span>{label}</span>
                  <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[clamp(10px,0.75vw,11px)] text-gray-700">
                    {faNumber(value)}
                  </span>
                </button>
              ))}
            </div>
          }
        />

        {selectedDevice ? (
          <GatewayDetailsDrawer
            device={selectedDevice}
            alerts={selectedAlerts}
            onClose={() => selectDevice(null)}
          />
        ) : null}
      </main>
    </LoadingWrapper>
  );
}

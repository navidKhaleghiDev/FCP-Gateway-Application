import { useEffect, useRef, useState } from 'react';
import { useGetAlerts, useGetDevices, type DeviceListParams } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import { APP_CONFIG } from '@/config/app';
import { AlertTriangle, Battery, Clock3, PlugZap, RadioTower, Search, ShieldAlert, Signal, Thermometer, Wifi, X } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';
import { DeviceMap } from '@/components/organisms/deviceMap';
import { GatewayDetailsDrawer } from '@/components/organisms/gatewayDetailsDrawer';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { useDeviceStore } from '@/stores/deviceStore';
import { useLiveData } from '@/hooks/useLiveData';
import { LoadingWrapper } from '@/components/molecules/loadingWrapper';
import { fa, faNumber } from '@/lib/i18n';
import { cn, relativeTime } from '@/lib/utils';

const MAP_FILTER_DEFAULTS = { search: '', filter: 'all' };

export function MapPage() {
  const { data: liveDevices, isLoading, isError, refetch } = useLiveData();
  const deviceRecord = useDeviceStore((state) => state.devices);
  const selectDevice = useDeviceStore((state) => state.select);
  const selectedId = useDeviceStore((state) => state.selectedId);
  const selectedDevice = selectedId ? deviceRecord[selectedId] : undefined;
  const { data: selectedAlerts = [] } = useGetAlerts({ deviceId: selectedId ?? '' }, { enabled: !!selectedId });
  const [focusRequest, setFocusRequest] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);
  const [{ search, filter }, setUrlState] = useQueryStates(
    {
      search: parseAsString.withDefault(MAP_FILTER_DEFAULTS.search),
      filter: parseAsString.withDefault(MAP_FILTER_DEFAULTS.filter),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const debouncedSearch = useDebounce(search, APP_CONFIG.searchDebounceMs);
  const selectedFilter: DeviceListParams['filter'] =
    ['all', 'online', 'urgent', 'faults', 'attention'].includes(filter)
      ? filter as DeviceListParams['filter'] : 'all';
  const hasActiveFilter = !!debouncedSearch.trim() || selectedFilter !== 'all';
  const { data: filteredResult } = useGetDevices({ search: debouncedSearch, filter: selectedFilter }, { enabled: hasActiveFilter });
  const filtered = hasActiveFilter ? filteredResult?.data ?? [] : liveDevices?.data ?? [];
  const summary = liveDevices?.meta.summary;
  const stats = {
    total: summary?.total ?? 0,
    online: summary?.online ?? 0,
    urgent: summary?.urgent ?? 0,
    faults: summary?.faults ?? 0,
  };
  const badges = [
    { key: 'all', label: fa.kpi.total, value: stats.total, icon: RadioTower, color: 'text-teal-600' },
    { key: 'online', label: fa.kpi.online, value: stats.online, icon: Wifi, color: 'text-teal-600' },
    { key: 'urgent', label: fa.kpi.urgent, value: stats.urgent, icon: ShieldAlert, color: 'text-red-600' },
    { key: 'faults', label: fa.kpi.faults, value: stats.faults, icon: AlertTriangle, color: 'text-amber-600' },
  ];

  return (
    <LoadingWrapper isLoading={isLoading} isError={isError} onRetry={() => refetch()}>
      <main className="relative h-screen overflow-hidden">
        <DeviceMap devices={filtered} focusRequest={focusRequest} />
        {selectedDevice && (
          <>
            <GatewayDetailsDrawer
              device={selectedDevice}
              alerts={selectedAlerts}
              onClose={() => selectDevice(null)}
            />
          </>
        )}
        <div className="fixed left-3 right-3 top-3 z-[900] flex items-start gap-2 md:right-[80px]" dir="rtl">
          <div ref={searchRef} className="relative w-52 shrink-0 sm:w-72 lg:w-80">
            <div className="flex h-9 items-center gap-2 rounded-full border border-white bg-white px-3 shadow-md">
              <Search size={16} className="shrink-0 text-teal-600" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => { setUrlState({ search: event.target.value }); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); }}
                placeholder="جستجوی دستگاه..."
                aria-label="جستجوی دستگاه روی نقشه"
                aria-expanded={searchOpen}
                aria-controls="map-search-results"
                className="map-search-input min-w-0 flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
              />
              {search && <button type="button" aria-label="پاک کردن جستجو" onClick={() => { setUrlState({ search: '' }); setSearchOpen(false); }}><X size={14} /></button>}
            </div>
            {searchOpen && (
              <div id="map-search-results" className="fixed bottom-24 right-3 top-14 flex w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:bottom-3 md:right-[80px]" role="region" aria-label="نتایج جستجوی دستگاه‌ها">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="m-0 text-sm font-semibold text-gray-900">{fa.map.network}</p>
                  <p className="m-0 mt-1 text-xs text-gray-500">{faNumber(filtered.length)} {fa.map.visible}</p>
                </div>
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
                {filtered.map((device) => (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => { selectDevice(device.id); setFocusRequest((request) => request + 1); setSearchOpen(false); }}
                    className={cn('block w-full rounded-xl border border-gray-100 bg-white p-3 text-right transition hover:border-teal-200 hover:bg-teal-50 focus:bg-teal-50', selectedId === device.id && 'border-teal-300 bg-teal-50')}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <strong className="block truncate text-sm font-semibold text-gray-900">{device.name}</strong>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">{device.buildingName} · {device.id}</span>
                      </span>
                      <StatusBadge status={device.status === 'offline' ? 'offline' : undefined} priority={device.status === 'online' ? device.priority : undefined} />
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1"><Battery size={13} aria-hidden="true" />{faNumber(Math.round(device.battery))}%</span>
                      <span className="inline-flex items-center gap-1"><Signal size={13} aria-hidden="true" /><span dir="ltr">{faNumber(device.signalStrength)} dBm</span></span>
                      <span className="inline-flex items-center gap-1"><Thermometer size={13} aria-hidden="true" />{faNumber(device.temperature.toFixed(1))}°</span>
                      <span className="inline-flex items-center gap-1"><PlugZap size={13} aria-hidden="true" />{device.acPower ? fa.details.healthy : fa.details.failed}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={13} aria-hidden="true" />{relativeTime(device.lastSeen)}</span>
                    </span>
                    {(device.hasFaults || !device.acPower || device.urgentAlarm) && (
                      <span className="mt-2 block text-xs font-medium text-amber-700">
                        {device.urgentAlarm ? fa.kpi.urgent : device.hasFaults ? fa.kpi.faults : fa.details.powerFailure}
                      </span>
                    )}
                  </button>
                ))}
                {!filtered.length && <p className="px-3 py-4 text-center text-xs text-gray-500">{fa.map.empty}</p>}
                </div>
              </div>
            )}
          </div>
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
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[clamp(10px,0.75vw,11px)] text-gray-700">{faNumber(value)}</span>
            </button>
          ))}
          </div>
        </div>
      </main>
    </LoadingWrapper>
  );
}

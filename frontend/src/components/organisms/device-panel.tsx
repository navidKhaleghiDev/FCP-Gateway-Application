import { Battery, ChevronRight, Radio, Search, Signal, TriangleAlert, X } from 'lucide-react';
import type { Device } from '@/types';
import { SearchField } from '@/components/molecules/search-field';
import { StatusBadge } from '@/components/atoms/status-badge';
import { relativeTime, cn } from '@/lib/utils';
import { useDeviceStore } from '@/stores/device-store';
import { fa, faNumber } from '@/lib/i18n';

interface IProps {
  devices: Device[];
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
}

/**
 * Displays the searchable device list beside the live map.
 * @component
 * @param {IProps} props - Device list, search, and filter state.
 * @param {Device[]} props.devices - Devices displayed in the panel.
 * @param {(value: string) => void} props.setSearch - Search update callback.
 * @param {(value: string) => void} props.setFilter - Filter update callback.
 * @returns {JSX.Element} A searchable device panel.
 */


export function DevicePanel({ devices, search, setSearch, filter, setFilter }: IProps) {
  const selected = useDeviceStore((s) => s.selectedId);
  const select = useDeviceStore((s) => s.select);
  return (
    <section className="glass fixed bottom-4 right-3 top-[82px] z-[900] flex w-[360px] flex-col overflow-hidden rounded-[1.5rem] md:right-[100px]">
      <div className="border-b border-gray-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="m-0 text-sm font-medium text-gray-900">{fa.map.network}</h2>
            <p className="m-0 mt-1 text-xs text-gray-500">
              {faNumber(devices.length)} {fa.map.visible}
            </p>
          </div>
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X size={17} />
          </button>
        </div>
        <SearchField value={search} onChange={setSearch} />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-lg px-2 py-1 text-[11px]',
              filter === 'all'
                ? 'bg-teal-50 font-medium text-teal-600'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {fa.map.all}
          </button>
          <button
            onClick={() => setFilter('attention')}
            className={cn(
              'rounded-lg px-2 py-1 text-[11px]',
              filter === 'attention'
                ? 'bg-teal-50 font-medium text-teal-600'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            <TriangleAlert size={12} className="ml-1 inline" />
            {fa.map.attention}
          </button>
        </div>
      </div>
      <div className="scrollbar flex-1 overflow-y-auto p-2">
        {devices.slice(0, 60).map((d) => (
          <button
            key={d.id}
            onClick={() => select(d.id)}
            className={cn(
              'mb-1 w-full rounded-lg border border-transparent p-3 text-right transition hover:bg-gray-100',
              selected === d.id && 'border-teal-200 bg-teal-50/80'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                    d.status === 'offline'
                      ? 'bg-gray-100 text-gray-500'
                      : d.priority === 'urgent'
                        ? 'bg-red-100 text-red-600'
                        : d.priority === 'warning'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-teal-50 text-teal-600'
                  )}
                >
                  <Radio size={17} />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate text-xs font-medium text-gray-900">
                    {d.name}
                  </strong>
                  <small className="block truncate text-[10px] text-gray-500">
                    {d.buildingName}
                  </small>
                </span>
              </div>
              <ChevronRight size={15} className="rotate-180 text-gray-400" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500">
              <StatusBadge
                status={d.status === 'offline' ? 'offline' : undefined}
                priority={d.status === 'online' ? d.priority : undefined}
              />
              <span className="flex gap-3">
                <i className="not-italic">
                  <Battery size={11} className="mr-1 inline" />
                  {faNumber(Math.round(d.battery))}٪
                </i>
                <i className="not-italic">
                  <Signal size={11} className="mr-1 inline" />
                  {faNumber(d.signalStrength)}
                </i>
                <span>{relativeTime(d.lastSeen)}</span>
              </span>
            </div>
          </button>
        ))}
        {!devices.length && (
          <div className="grid h-40 place-items-center text-center text-sm text-gray-500">
            <div>
              <Search className="mx-auto mb-2" />
              <p>{fa.map.empty}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

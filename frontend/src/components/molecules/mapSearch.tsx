import { useEffect, useRef, useState } from 'react';
import { Battery, Clock3, PlugZap, Signal, Thermometer } from 'lucide-react';

import type { Device } from '@/types';
import { SearchField } from '@/components/molecules/searchField';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { fa, faNumber } from '@/lib/i18n';
import { cn, relativeTime } from '@/lib/utils';

export interface MapSearchProps {
  value: string;
  onChange: (value: string) => void;
  devices: Device[];
  selectedId: string | null;
  onSelectDevice: (id: string) => void;
}

/** Map search input and its device results panel. */
export function MapSearch({
  value,
  onChange,
  devices,
  selectedId,
  onSelectDevice,
}: MapSearchProps) {
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-52 shrink-0 sm:w-72 lg:w-80">
      <SearchField
        value={value}
        onChange={onChange}
        variant="map"
        placeholder={fa.map.search}
        ariaLabel={fa.map.search}
        ariaExpanded={open}
        ariaControls="map-search-results"
        onFocus={() => setOpen(true)}
        onClear={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
      />
      {open && (
        <div
          id="map-search-results"
          className="fixed bottom-24 right-3 top-14 flex w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:bottom-3 md:right-20"
          role="region"
          aria-label={fa.map.network}
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="m-0 text-sm font-semibold text-gray-900">{fa.map.network}</p>
            <p className="m-0 mt-1 text-xs text-gray-500">
              {faNumber(devices.length)} {fa.map.visible}
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
            {devices.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => {
                  onSelectDevice(device.id);
                  setOpen(false);
                }}
                className={cn(
                  'block w-full rounded-xl border border-gray-100 bg-white p-3 text-right transition hover:border-teal-200 hover:bg-teal-50 focus:bg-teal-50',
                  selectedId === device.id && 'border-teal-300 bg-teal-50'
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <strong className="block truncate text-sm font-semibold text-gray-900">
                      {device.name}
                    </strong>
                    <span className="mt-0.5 block truncate text-xs text-gray-500">
                      {device.buildingName} · {device.id}
                    </span>
                  </span>
                  <StatusBadge
                    status={device.status === 'offline' ? 'offline' : undefined}
                    priority={device.status === 'online' ? device.priority : undefined}
                  />
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Battery size={13} aria-hidden="true" />
                    {faNumber(Math.round(device.battery))}%
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Signal size={13} aria-hidden="true" />
                    <span dir="ltr">{faNumber(device.signalStrength)} dBm</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Thermometer size={13} aria-hidden="true" />
                    {faNumber(device.temperature.toFixed(1))}°
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <PlugZap size={13} aria-hidden="true" />
                    {device.acPower ? fa.details.healthy : fa.details.failed}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={13} aria-hidden="true" />
                    {relativeTime(device.lastSeen)}
                  </span>
                </span>
                {(device.hasFaults || !device.acPower || device.urgentAlarm) && (
                  <span className="mt-2 block text-xs font-medium text-amber-700">
                    {device.urgentAlarm
                      ? fa.kpi.urgent
                      : device.hasFaults
                        ? fa.kpi.faults
                        : fa.details.powerFailure}
                  </span>
                )}
              </button>
            ))}
            {!devices.length && (
              <p className="px-3 py-4 text-center text-xs text-gray-500">{fa.map.empty}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

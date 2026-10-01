import { Eye } from 'lucide-react';
import type { Device } from '@/types';
import { Button } from '@/components/atoms/button';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { DataTable, type DataTableColumn } from '@/components/organisms/dataTable';
import { fa, faNumber } from '@/lib/i18n';

interface DeviceTableProps {
  devices: readonly Device[];
  onView: (id: string) => void;
}

/**
 * Renders device rows using the reusable typed data table.
 * @component
 * @param {DeviceTableProps} props - Device rows and view callback.
 * @param {(id: string) => void} props.onView - Callback for opening a device.
 * @returns {JSX.Element} A device data table.
 */


export function DeviceTable({ devices, onView }: DeviceTableProps) {
  const columns: DataTableColumn<Device>[] = [
    {
      key: 'gateway',
      header: fa.fleet.gateway,
      cell: (d) => (
        <>
          <span className="flex items-center gap-2">
            <strong className="truncate font-semibold text-gray-900">{d.name}</strong>
            <span className="relative inline-flex h-3 w-3 shrink-0 items-center justify-center" role="img" aria-label={fa.status[d.status]} title={fa.status[d.status]}>
              {d.status === 'online' && <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-teal-400 opacity-70 motion-reduce:animate-none" />}
              <span className={d.status === 'online' ? 'relative h-2.5 w-2.5 rounded-full bg-teal-600' : 'relative h-2.5 w-2.5 rounded-full bg-slate-400'} />
            </span>
          </span>
          <span className="text-xs text-gray-500" dir="ltr">
            {d.id}
          </span>
        </>
      ),
    },
    {
      key: 'building',
      header: fa.fleet.building,
      cell: (d) => d.buildingName,
      className: 'px-5 py-5 text-gray-700',
    },
    {
      key: 'priority',
      header: fa.fleet.priority,
      cell: (d) => <StatusBadge priority={d.priority} />,
    },
    {
      key: 'battery',
      header: fa.fleet.battery,
      cell: (d) => `${faNumber(Math.round(d.battery))}٪`,
      className: 'px-5 py-5 text-gray-700',
    },
    {
      key: 'signal',
      header: fa.fleet.signal,
      cell: (d) => <span dir="ltr">{faNumber(d.signalStrength)} dBm</span>,
      className: 'px-5 py-5 text-gray-700',
    },
    {
      key: 'temperature',
      header: fa.fleet.temperature,
      cell: (d) => `${faNumber(d.temperature.toFixed(1))}°C`,
      className: 'px-5 py-5 text-gray-700',
    },
    {
      key: 'actions',
      header: '',
      cell: (d) => (
        <Button variant="ghost" className="h-9 w-9 p-0" aria-label={fa.common.view + " " + d.name} title={fa.common.view} onClick={() => onView(d.id)}>
          <Eye size={15} />
        </Button>
      ),
    },
  ];

  return <DataTable rows={devices} columns={columns} rowKey={(device) => device.id} />;
}

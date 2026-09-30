import { Eye } from 'lucide-react';
import type { Device } from '@/types';
import { Button } from '@/components/atoms/button';
import { StatusBadge } from '@/components/atoms/status-badge';
import { DataTable, type DataTableColumn } from '@/components/organisms/data-table';
import { fa, faNumber } from '@/lib/i18n';
import { relativeTime } from '@/lib/utils';

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
          <strong className="block font-medium text-gray-900">{d.name}</strong>
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
      className: 'px-5 py-3 text-gray-700',
    },
    { key: 'status', header: fa.fleet.status, cell: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'priority',
      header: fa.fleet.priority,
      cell: (d) => <StatusBadge priority={d.priority} />,
    },
    {
      key: 'battery',
      header: fa.fleet.battery,
      cell: (d) => `${faNumber(Math.round(d.battery))}٪`,
      className: 'px-5 py-3 text-gray-700',
    },
    {
      key: 'signal',
      header: fa.fleet.signal,
      cell: (d) => <span dir="ltr">{faNumber(d.signalStrength)} dBm</span>,
      className: 'px-5 py-3 text-gray-700',
    },
    {
      key: 'temperature',
      header: fa.fleet.temperature,
      cell: (d) => `${faNumber(d.temperature.toFixed(1))}°C`,
      className: 'px-5 py-3 text-gray-700',
    },
    {
      key: 'lastSeen',
      header: fa.fleet.lastSeen,
      cell: (d) => relativeTime(d.lastSeen),
      className: 'px-5 py-3 text-gray-500',
    },
    {
      key: 'actions',
      header: '',
      cell: (d) => (
        <Button variant="ghost" onClick={() => onView(d.id)}>
          <Eye size={15} />
          {fa.common.view}
        </Button>
      ),
    },
  ];

  return <DataTable rows={devices} columns={columns} rowKey={(device) => device.id} />;
}

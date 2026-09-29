import type { DevicePriority, DeviceStatus } from '@sentinel/shared';
import { cn } from '@/lib/utils';
import { statusLabel } from '@/lib/i18n';

interface IProps {
  status?: DeviceStatus;
  priority?: DevicePriority;
}

/**
 * Displays the localized status or priority of a device.
 *
 * @component
 * @param {IProps} props - Device status or priority.
 * @param {DeviceStatus} [props.status] - Connectivity status.
 * @param {DevicePriority} [props.priority] - Operational priority.
 * @returns {JSX.Element} A localized status badge.
 */
export function StatusBadge({ status, priority }: IProps) {
  const value = status ?? priority ?? 'normal';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium',
        value === 'normal' && 'bg-teal-50 text-teal-600',
        value === 'online' && 'bg-teal-50 text-teal-600',
        value === 'warning' && 'bg-amber-100 text-amber-700',
        value === 'urgent' && 'bg-red-100 text-red-600',
        value === 'offline' && 'bg-gray-100 text-gray-500'
      )}
    >
      <i className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(value)}
    </span>
  );
}

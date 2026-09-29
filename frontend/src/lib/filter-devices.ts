import type { Device, DevicePriority, DeviceStatus } from '@sentinel/shared';
export function filterDevices(
  devices: Device[],
  search: string,
  status: 'all' | DeviceStatus = 'all',
  priority: 'all' | DevicePriority = 'all'
) {
  const q = search.trim().toLowerCase();
  return devices.filter(
    (d) =>
      (!q || `${d.name} ${d.id} ${d.buildingName}`.toLowerCase().includes(q)) &&
      (status === 'all' || d.status === status) &&
      (priority === 'all' || d.priority === priority)
  );
}

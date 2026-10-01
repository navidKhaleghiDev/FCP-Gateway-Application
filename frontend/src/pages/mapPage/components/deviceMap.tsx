import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { CircleCheck, TriangleAlert, WifiOff, Wrench } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Device } from '@/types';
import type { MapSearchProps } from '@/components/molecules/mapSearch';
import { useDeviceStore } from '@/stores/deviceStore';
import '@/components/organisms/deviceMap.css';
import { FocusSelectedDevice } from './FocusSelectedDevice';
import { MapControls } from './MapControls';

const marker = (d: Device) => {
  const state =
    d.status === 'offline'
      ? 'offline'
      : d.hasFaults || !d.acPower
        ? 'fault'
        : d.urgentAlarm || d.priority === 'urgent'
          ? 'urgent'
          : d.priority === 'warning'
            ? 'warning'
            : 'healthy';
  const Icon =
    state === 'offline'
      ? WifiOff
      : state === 'fault'
        ? Wrench
        : state === 'healthy'
          ? CircleCheck
          : TriangleAlert;
  return L.divIcon({
    className: `gateway-marker marker-${state}`,
    html: renderToStaticMarkup(<Icon size={18} strokeWidth={1.8} aria-hidden="true" />),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

/**
 * Renders fleet devices as interactive markers on a Leaflet map.
 * @component
 * @param {{ devices: Device[] }} props - Devices displayed on the map.
 * @param {Device[]} props.devices - Devices with coordinates and current status.
 * @returns {JSX.Element} An interactive device map.
 */

interface Props {
  devices: Device[];
  focusRequest?: number;
  search: MapSearchProps;
  filters: ReactNode;
}

export function DeviceMap({ devices, focusRequest = 0, search, filters }: Props) {
  const selectedId = useDeviceStore((s) => s.selectedId);
  const select = useDeviceStore((s) => s.select);
  const selected = devices.find((d) => d.id === selectedId);
  const icons = useMemo(() => Object.fromEntries(devices.map((d) => [d.id, marker(d)])), [devices]);
  return (
    <MapContainer center={[35.7219, 51.3347]} zoom={12} zoomControl={false} className="z-0">
      <FocusSelectedDevice device={selected} focusRequest={focusRequest} />
      <MapControls search={search} filters={filters} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[35.704, 51.37]}
        radius={5200}
        pathOptions={{
          color: '#14b8a6',
          weight: 2,
          fillColor: '#0891b2',
          fillOpacity: 0.08,
        }}
      />
      {devices.map((d) => (
        <Marker
          key={d.id}
          position={[d.latitude, d.longitude]}
          icon={icons[d.id]}
          eventHandlers={{ click: () => select(d.id) }}
        />
      ))}
    </MapContainer>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CircleCheck, Crosshair, LoaderCircle, Minus, Plus, TriangleAlert, WifiOff, Wrench } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { toast } from 'sonner';
import type { Device } from '@/types';
import { IconButton } from '@/components/atoms/iconButton';
import { useDeviceStore } from '@/stores/deviceStore';
import './deviceMap.css';
const marker = (d: Device) => {
  const state = d.status === 'offline'
    ? 'offline'
    : d.hasFaults || !d.acPower
      ? 'fault'
      : d.urgentAlarm || d.priority === 'urgent'
        ? 'urgent'
        : d.priority === 'warning'
          ? 'warning'
          : 'healthy';
  const Icon = state === 'offline' ? WifiOff : state === 'fault' ? Wrench : state === 'healthy' ? CircleCheck : TriangleAlert;
  return L.divIcon({
    className: `gateway-marker marker-${state}`,
    html: renderToStaticMarkup(<Icon size={18} strokeWidth={1.8} aria-hidden="true" />),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

function FocusSelectedDevice({ device, focusRequest }: { device?: Device; focusRequest: number }) {
  const map = useMap();
  const deviceId = device?.id;
  const latitude = device?.latitude;
  const longitude = device?.longitude;
  useEffect(() => {
    if (!deviceId || latitude === undefined || longitude === undefined) return;
    const position = L.latLng(latitude, longitude);
    const targetZoom = Math.max(map.getZoom(), 15);
    const offset: [number, number] = window.innerWidth >= 768 ? [190, 0] : [0, Math.round(window.innerHeight * 0.35)];
    if (map.getCenter().equals(position) && map.getZoom() === targetZoom) {
      map.panBy(offset);
      return;
    }
    const revealBesideDrawer = () => map.panBy(offset);
    map.once('moveend', revealBesideDrawer);
    map.flyTo(position, targetZoom);
    return () => { map.off('moveend', revealBesideDrawer); };
  }, [deviceId, latitude, longitude, focusRequest, map]);
  return null;
}

function MapControls() {
  const map = useMap();
  const selectedId = useDeviceStore((state) => state.selectedId);
  const [zoom, setZoom] = useState(map.getZoom());
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const locate = () => {
    if (!navigator.geolocation) {
      toast.error('موقعیت مکانی در این مرورگر در دسترس نیست.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];
        setLocation(position);
        setLocating(false);
        map.flyTo(position, Math.max(map.getZoom(), 15));
      },
      (error) => {
        setLocating(false);
        toast.error(error.code === 1
          ? 'برای نمایش موقعیت خود، دسترسی مکانی مرورگر را فعال کنید.'
          : 'دریافت موقعیت مکانی ممکن نشد. دوباره تلاش کنید.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };
  return (
    <>
      <div className={`absolute left-3 z-[900] flex flex-col gap-2 ${selectedId ? 'top-16 md:bottom-4 md:top-auto' : 'bottom-24 md:bottom-4'}`} onDoubleClick={(event) => event.stopPropagation()}>
        <IconButton label="بزرگ‌نمایی نقشه" onClick={() => map.zoomIn()} disabled={zoom >= map.getMaxZoom()}>
          <Plus size={19} aria-hidden="true" />
        </IconButton>
        <IconButton label="کوچک‌نمایی نقشه" onClick={() => map.zoomOut()} disabled={zoom <= map.getMinZoom()}>
          <Minus size={19} aria-hidden="true" />
        </IconButton>
        <IconButton label="نمایش موقعیت من روی نقشه" onClick={locate} disabled={locating}>
          {locating ? <LoaderCircle size={19} className="animate-spin" aria-hidden="true" /> : <Crosshair size={19} aria-hidden="true" />}
        </IconButton>
      </div>
      {location && (
        <CircleMarker center={location} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#0d9488', fillOpacity: 1 }}>
          <Popup>موقعیت شما</Popup>
        </CircleMarker>
      )}
    </>
  );
}

  
/**
 * Renders fleet devices as interactive markers on a Leaflet map.
 * @component
 * @param {{ devices: Device[] }} props - Devices displayed on the map.
 * @param {Device[]} props.devices - Devices with coordinates and current status.
 * @returns {JSX.Element} An interactive device map.
 */

export function DeviceMap({ devices, focusRequest = 0 }: { devices: Device[]; focusRequest?: number }) {
  const selectedId = useDeviceStore((s) => s.selectedId);
  const select = useDeviceStore((s) => s.select);
  const selected = devices.find((d) => d.id === selectedId);
  const icons = useMemo(
    () => Object.fromEntries(devices.map((d) => [d.id, marker(d)])),
    [devices]
  );
  return (
    <MapContainer center={[35.7219, 51.3347]} zoom={12} zoomControl={false} className="z-0">
      <FocusSelectedDevice device={selected} focusRequest={focusRequest} />
      <MapControls />
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

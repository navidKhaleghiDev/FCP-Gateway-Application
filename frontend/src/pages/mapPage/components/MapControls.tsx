import type { ReactNode } from 'react';
import { useState } from 'react';
import { CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { toast } from 'sonner';
import { Crosshair, LoaderCircle, Minus, Plus } from 'lucide-react';

import { IconButton } from '@/components/atoms/iconButton';
import { useDeviceStore } from '@/stores/deviceStore';
import { MapSearch, type MapSearchProps } from '@/components/molecules/mapSearch';

export function MapControls({ search, filters }: { search: MapSearchProps; filters: ReactNode }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);

  const selectedId = useDeviceStore((state) => state.selectedId);
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
        toast.error(
          error.code === 1
            ? 'برای نمایش موقعیت خود، دسترسی مکانی مرورگر را فعال کنید.'
            : 'دریافت موقعیت مکانی ممکن نشد. دوباره تلاش کنید.'
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  return (
    <>
      <div
        className="fixed left-3 right-3 top-3 z-900 flex items-start gap-2 md:right-20"
        dir="rtl"
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <MapSearch {...search} />
        {filters}
      </div>
      <div
        className={`absolute left-3 z-900 flex flex-col gap-2 ${selectedId ? 'top-16 md:bottom-4 md:top-auto' : 'bottom-24 md:bottom-4'}`}
        onDoubleClick={(event) => event.stopPropagation()}
      >
        <IconButton
          label="بزرگ‌نمایی نقشه"
          onClick={() => map.zoomIn()}
          disabled={zoom >= map.getMaxZoom()}
        >
          <Plus size={19} aria-hidden="true" />
        </IconButton>
        <IconButton
          label="کوچک‌نمایی نقشه"
          onClick={() => map.zoomOut()}
          disabled={zoom <= map.getMinZoom()}
        >
          <Minus size={19} aria-hidden="true" />
        </IconButton>
        <IconButton label="نمایش موقعیت من روی نقشه" onClick={locate} disabled={locating}>
          {locating ? (
            <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair size={19} aria-hidden="true" />
          )}
        </IconButton>
      </div>
      {location && (
        <CircleMarker
          center={location}
          radius={8}
          pathOptions={{ color: '#fff', weight: 3, fillColor: '#0d9488', fillOpacity: 1 }}
        >
          <Popup>موقعیت شما</Popup>
        </CircleMarker>
      )}
    </>
  );
}

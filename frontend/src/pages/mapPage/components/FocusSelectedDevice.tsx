import L from 'leaflet';
import { Device } from '@/types';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface Props {
  device?: Device;
  focusRequest: number;
}

export function FocusSelectedDevice({ device, focusRequest }: Props) {
  const map = useMap();
  const deviceId = device?.id;
  const latitude = device?.latitude;
  const longitude = device?.longitude;
  useEffect(() => {
    if (!deviceId || latitude === undefined || longitude === undefined) return;
    const position = L.latLng(latitude, longitude);
    const targetZoom = Math.max(map.getZoom(), 15);
    const offset: [number, number] =
      window.innerWidth >= 768 ? [190, 0] : [0, Math.round(window.innerHeight * 0.35)];
    if (map.getCenter().equals(position) && map.getZoom() === targetZoom) {
      map.panBy(offset);
      return;
    }
    const revealBesideDrawer = () => map.panBy(offset);
    map.once('moveend', revealBesideDrawer);
    map.flyTo(position, targetZoom);
    return () => {
      map.off('moveend', revealBesideDrawer);
    };
  }, [deviceId, latitude, longitude, focusRequest, map]);
  return null;
}

import { useMemo } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Device } from "@sentinel/shared";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { useDeviceStore } from "@/stores/device-store";
import { fa, faNumber } from "@/lib/i18n";
const marker = (d: Device) =>
  L.divIcon({
    className: `gateway-marker ${d.status === "offline" ? "marker-offline" : `marker-${d.priority}`}`,
    html: "",
    iconSize: [28, 28],
  });
export function DeviceMap({ devices }: { devices: Device[] }) {
  const selectedId = useDeviceStore((s) => s.selectedId);
  const select = useDeviceStore((s) => s.select);
  const navigate = useNavigate();
  const selected = devices.find((d) => d.id === selectedId);
  const icons = useMemo(
    () =>
      Object.fromEntries(
        devices.map((d) => [`${d.id}-${d.status}-${d.priority}`, marker(d)]),
      ),
    [devices],
  );
  return (
    <MapContainer
      center={[35.7219, 51.3347]}
      zoom={12}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomleft" />
      <Circle
        center={[35.704, 51.37]}
        radius={5200}
        pathOptions={{
          color: "#14b8a6",
          weight: 2,
          fillColor: "#0891b2",
          fillOpacity: 0.08,
        }}
      />
      {devices.map((d) => (
        <Marker
          key={d.id}
          position={[d.latitude, d.longitude]}
          icon={icons[`${d.id}-${d.status}-${d.priority}`]}
          eventHandlers={{ click: () => select(d.id) }}
        >
          <Popup>
            <div className="min-w-[210px] text-slate-800">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <strong className="block text-sm">{d.name}</strong>
                  <span className="text-xs text-slate-500">{d.id}</span>
                </div>
                <StatusBadge
                  priority={d.status === "offline" ? undefined : d.priority}
                  status={d.status === "offline" ? "offline" : undefined}
                />
              </div>
              <p className="mb-2 text-xs text-slate-500">{d.buildingName}</p>
              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <span className="rounded bg-slate-100 p-1">
                  {faNumber(Math.round(d.battery))}٪
                </span>
                <span className="rounded bg-slate-100 p-1">
                  {d.temperature.toFixed(1)}°
                </span>
                <span className="rounded bg-slate-100 p-1">
                  <span dir="ltr">{faNumber(d.signalStrength)} dBm</span>
                </span>
              </div>
              <Button
                className="mt-3 w-full"
                onClick={() => navigate(`/devices/${d.id}`)}
              >
                {fa.common.view} <ExternalLink size={13} />
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
      {selected && null}
    </MapContainer>
  );
}

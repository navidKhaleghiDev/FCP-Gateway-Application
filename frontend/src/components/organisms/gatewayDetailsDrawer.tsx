import { useEffect } from 'react';
import { Battery, Clock3, ExternalLink, MapPin, PlugZap, Signal, Thermometer, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Alert, Device } from '@/types';
import { Button } from '@/components/atoms/button';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { GatewayAlertsContent } from '@/components/organisms/gatewayAlertsPanel';
import { eventLabel, fa, faNumber } from '@/lib/i18n';
import { relativeTime } from '@/lib/utils';

interface GatewayDetailsDrawerProps {
  device: Device;
  alerts: Alert[];
  onClose: () => void;
}

export function GatewayDetailsDrawer({ device, alerts, onClose }: GatewayDetailsDrawerProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const latestAlert = alerts[0];

  return (
    <aside className="fixed bottom-24 left-3 right-3 z-[850] flex max-h-[65vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:bottom-3 md:left-auto md:right-[80px] md:top-14 md:max-h-none md:w-[390px]" aria-labelledby="gateway-drawer-title">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="min-w-0">
          <h2 id="gateway-drawer-title" className="m-0 truncate text-lg font-semibold text-gray-900">{device.name}</h2>
          <p className="m-0 mt-0.5 text-xs text-gray-500" dir="ltr">{device.id}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={device.status} />
            {device.status === 'online' && <StatusBadge priority={device.priority} />}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="بستن جزئیات درگاه" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"><X size={17} /></button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <GatewayAlertsContent alerts={alerts} />
        <section className="rounded-xl bg-slate-50 p-3">
          <h3 className="m-0 flex items-center gap-2 text-sm font-semibold text-gray-800"><MapPin size={15} className="text-teal-600" />موقعیت درگاه</h3>
          <p className="mb-2 mt-2 text-sm text-gray-700">{device.buildingName}</p>
          <p className="mb-2 mt-0 text-xs text-gray-500">نشانی خیابان برای این درگاه ثبت نشده است.</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white p-2"><span className="block text-gray-500">عرض جغرافیایی</span><strong className="mt-1 block font-medium text-gray-800" dir="ltr">{device.latitude.toFixed(6)}</strong></div>
            <div className="rounded-lg bg-white p-2"><span className="block text-gray-500">طول جغرافیایی</span><strong className="mt-1 block font-medium text-gray-800" dir="ltr">{device.longitude.toFixed(6)}</strong></div>
          </div>
        </section>

        <section>
          <h3 className="m-0 text-sm font-semibold text-gray-800">وضعیت لحظه‌ای</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-gray-100 p-3 text-xs"><Battery size={16} className="mb-2 text-teal-600" /><span className="block text-gray-500">{fa.details.battery}</span><strong className="text-sm text-gray-900">{faNumber(Math.round(device.battery))}%</strong></div>
            <div className="rounded-xl border border-gray-100 p-3 text-xs"><Signal size={16} className="mb-2 text-teal-600" /><span className="block text-gray-500">{fa.details.signal}</span><strong className="text-sm text-gray-900" dir="ltr">{faNumber(device.signalStrength)} dBm</strong></div>
            <div className="rounded-xl border border-gray-100 p-3 text-xs"><Thermometer size={16} className="mb-2 text-teal-600" /><span className="block text-gray-500">{fa.details.temperature}</span><strong className="text-sm text-gray-900">{faNumber(device.temperature.toFixed(1))}°</strong></div>
            <div className="rounded-xl border border-gray-100 p-3 text-xs"><PlugZap size={16} className="mb-2 text-teal-600" /><span className="block text-gray-500">{fa.details.acSupply}</span><strong className="text-sm text-gray-900">{device.acPower ? fa.details.healthy : fa.details.failed}</strong></div>
          </div>
          <p className="mb-0 mt-2 flex items-center gap-1 text-xs text-gray-500"><Clock3 size={13} />{fa.fleet.lastSeen}: {relativeTime(device.lastSeen)}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={device.hasFaults ? 'rounded-full bg-red-50 px-2 py-1 text-red-700' : 'rounded-full bg-teal-50 px-2 py-1 text-teal-700'}>{fa.details.technicalFault}: {device.hasFaults ? fa.details.detected : fa.details.clear}</span>
            <span className={device.urgentAlarm ? 'rounded-full bg-red-50 px-2 py-1 text-red-700' : 'rounded-full bg-teal-50 px-2 py-1 text-teal-700'}>{fa.details.urgentAlarm}: {device.urgentAlarm ? fa.details.active : fa.details.clear}</span>
          </div>
        </section>

        <section>
          <h3 className="m-0 text-sm font-semibold text-gray-800">آخرین رویداد ثبت‌شده</h3>
          {latestAlert ? (
            <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs">
              <strong className="block text-gray-900">{eventLabel[latestAlert.kind]}</strong>
              <p className="my-1 text-gray-700">{latestAlert.message}</p>
              <span className="text-gray-500">{relativeTime(latestAlert.timestamp)} · {latestAlert.resolvedAt ? fa.alerts.resolved : fa.alerts.opened}</span>
            </div>
          ) : <p className="mt-2 text-xs text-gray-500">رویداد هشداری برای این درگاه ثبت نشده است.</p>}
        </section>

      </div>

      <div className="border-t border-gray-100 p-3">
        <Button className="w-full" onClick={() => navigate(`/devices/${device.id}`)}>{fa.common.view} <ExternalLink size={14} /></Button>
      </div>
    </aside>
  );
}

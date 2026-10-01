import { Bell, CloudOff, RefreshCw, Wifi } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useDeviceStore } from '@/stores/device-store';
import { cn } from '@/lib/utils';
import { fa, faNumber } from '@/lib/i18n';

/**
 * Renders the application header, connection state, and alert summary.
 * @component
 * @returns {JSX.Element} The application top bar.
 */


export function Topbar() {
  const connection = useDeviceStore((s) => s.connection);
  const alertRecord = useDeviceStore((state) => state.alerts);
  const alerts = Object.values(alertRecord).filter((alert) => !alert.resolvedAt);
  const location = useLocation();
  const isDeviceDetails = location.pathname.startsWith('/devices/');
  const title =
    location.pathname === '/'
      ? fa.pages.map
      : location.pathname.startsWith('/devices')
        ? fa.pages.devices
        : fa.pages.map;
  if (location.pathname === '/' || location.pathname === '/devices' || isDeviceDetails) return null;
  return (
    <header className="pointer-events-none fixed left-[64px] right-3 top-3 z-[1000] flex flex-row-reverse items-center justify-between md:right-[80px]">
      <div className="glass pointer-events-auto rounded-lg px-4 py-2.5 text-right">
        <p className="m-0 text-[clamp(9px,0.7vw,10px)] font-medium text-teal-600">{fa.brand}</p>
        <h1 className="m-0 text-sm font-medium text-gray-900">{title}</h1>
      </div>
      <div className="glass pointer-events-auto flex h-12 items-center gap-1 rounded-lg px-2">
        <span
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium',
            connection === 'connected' ? 'text-teal-600' : 'text-amber-600'
          )}
        >
          {connection === 'connected' ? (
            <Wifi size={15} />
          ) : connection === 'offline' ? (
            <CloudOff size={15} />
          ) : (
            <RefreshCw className="animate-spin" size={15} />
          )}
          <span className="hidden sm:inline">{fa.connection[connection]}</span>
        </span>
        <div className="h-5 w-px bg-gray-200" />
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
          {alerts.length > 0 && (
            <b className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[clamp(9px,0.65vw,9.5px)] text-white">
              {faNumber(alerts.length)}
            </b>
          )}
        </button>
        <div className="mr-1 grid h-8 w-8 place-items-center rounded-lg bg-teal-500 text-xs font-medium text-white">
          ن
        </div>
      </div>
    </header>
  );
}

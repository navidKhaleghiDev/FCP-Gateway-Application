import { Bell, CloudOff, RefreshCw, Wifi } from 'lucide-react';
import { useLocation, matchPath } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { IconButton } from '@/components/atoms/iconButton';
import { useAlertsPanel } from '@/app/alertsContext';
import { useDeviceStore } from '@/stores/deviceStore';
import { cn } from '@/lib/utils';
import { fa } from '@/lib/i18n';

/**
 * Renders the application header, connection state, and alert summary.
 * @component
 * @returns {JSX.Element} The application top bar.
 */

const routeTitles = [
  { path: ROUTES.HOME, title: fa.pages.map },
  { path: ROUTES.DEVICES, title: fa.pages.devices },
  { path: ROUTES.DEVICE_DETAILS, title: fa.pages.devices },
];

export function Navbar() {
  const { connection, latestAlert } = useDeviceStore((s) => s);
  const { openAlerts } = useAlertsPanel();

  const location = useLocation();

  const title =
    routeTitles.find(({ path }) => matchPath({ path, end: true }, location.pathname))?.title ??
    fa.brand;

  return (
    <header className="pointer-events-none fixed left-16 right-3 top-3 z-1000 flex flex-row-reverse items-center justify-between md:right-20">
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
        <IconButton
          label={fa.alerts.title}
          onClick={openAlerts}
          badge={latestAlert && !latestAlert.resolvedAt ? 1 : undefined}
          className="h-9 w-9 border-0 bg-transparent p-2 text-gray-500 shadow-none hover:bg-gray-100"
        >
          <Bell size={18} />
        </IconButton>
        <div className="mr-1 grid h-8 w-8 place-items-center rounded-lg bg-teal-500 text-xs font-medium text-white">
          {}
        </div>
      </div>
    </header>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/atoms/icon-button';
import { StatusBadge } from '@/components/atoms/status-badge';
import { useDeviceStore } from '@/stores/device-store';
import { eventLabel, fa, faNumber } from '@/lib/i18n';
import { relativeTime } from '@/lib/utils';
import { deviceDetailsPath } from '@/routes/paths';

export function FloatingAlerts() {
  const [open, setOpen] = useState(false);
  const alertRecord = useDeviceStore((state) => state.alerts);
  const alerts = useMemo(
    () => Object.values(alertRecord).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [alertRecord]
  );
  const activeCount = alerts.filter((alert) => !alert.resolvedAt).length;
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <>
      {!open && (
        <div className="fixed left-3 top-3 z-[1200]">
          <IconButton label="نمایش هشدارها" onClick={() => setOpen(true)} className="relative h-10 w-10 border-0 bg-transparent text-slate-700 shadow-none hover:bg-transparent hover:text-teal-700">
            <Bell size={20} aria-hidden="true" />
            {activeCount > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                {faNumber(activeCount)}
              </span>
            )}
          </IconButton>
        </div>
      )}
      {open && (
        <aside className="fixed bottom-24 left-3 right-3 top-14 z-[1200] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-auto sm:w-[380px] md:bottom-3" aria-labelledby="floating-alerts-title">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 id="floating-alerts-title" className="m-0 text-base font-semibold text-gray-900">{fa.alerts.title}</h2>
              <p className="m-0 mt-1 text-xs text-gray-500">{faNumber(activeCount)} هشدار فعال</p>
            </div>
            <IconButton label="بستن هشدارها" onClick={() => setOpen(false)} className="h-8 w-8 border-0 shadow-none">
              <X size={17} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(deviceDetailsPath(alert.deviceId));
                }}
                className="w-full rounded-xl border border-gray-100 p-3 text-right transition hover:border-teal-200 hover:bg-teal-50"
              >
                <span className="flex items-start justify-between gap-2">
                  <strong className="text-sm text-gray-900">{eventLabel[alert.kind]}</strong>
                  <StatusBadge priority={alert.priority} />
                </span>
                <span className="mt-1 block text-xs text-gray-700">{alert.message}</span>
                <span className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{relativeTime(alert.timestamp)} · {alert.resolvedAt ? fa.alerts.resolved : fa.alerts.opened}</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </span>
              </button>
            ))}
            {!alerts.length && (
              <div className="grid h-48 place-items-center text-center text-xs text-gray-500">
                <div><BellOff className="mx-auto mb-2" size={24} /><p>{fa.alerts.empty}</p></div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

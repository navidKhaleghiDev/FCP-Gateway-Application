import { useMemo } from 'react';
import { BellOff, ChevronRight, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeviceStore } from '@/stores/device-store';
import { useLiveData } from '@/hooks/use-live-data';
import { StatusBadge } from '@/components/atoms/status-badge';
import { Button } from '@/components/atoms/button';
import { relativeTime } from '@/lib/utils';
import { eventLabel, fa } from '@/lib/i18n';

export function AlertsPage() {
  useLiveData();
  const alertRecord = useDeviceStore((state) => state.alerts);
  const alerts = useMemo(
    () => Object.values(alertRecord).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [alertRecord]
  );
  const nav = useNavigate();
  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-8 pt-24 md:pr-[100px]">
      <section className="mx-auto max-w-5xl rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="m-0 text-lg font-medium text-gray-900">{fa.alerts.title}</h2>
        <p className="mt-1 text-sm text-gray-500">{fa.alerts.subtitle}</p>
        <div className="mt-5 space-y-2">
          {alerts.map((a) => (
            <article
              key={a.id}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${a.resolvedAt ? 'bg-gray-100 text-gray-500' : a.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}
              >
                {a.resolvedAt ? <BellOff size={18} /> : <Clock3 size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-medium text-gray-900">{a.message}</strong>
                  <StatusBadge priority={a.priority} />
                </div>
                <p className="my-1 text-xs text-gray-500">
                  <span dir="ltr">{a.deviceId}</span> · {eventLabel[a.kind]}
                </p>
                <small className="text-[10px] text-gray-400">
                  {a.resolvedAt
                    ? `${fa.alerts.resolved} ${relativeTime(a.resolvedAt)}`
                    : `${fa.alerts.opened} ${relativeTime(a.timestamp)}`}
                </small>
              </div>
              <Button variant="ghost" onClick={() => nav(`/devices/${a.deviceId}`)}>
                {fa.alerts.inspect} <ChevronRight className="rotate-180" size={15} />
              </Button>
            </article>
          ))}
          {!alerts.length && (
            <div className="grid h-64 place-items-center text-center text-gray-500">
              <div>
                <BellOff className="mx-auto mb-2" />
                <p>{fa.alerts.empty}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

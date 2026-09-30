import { AlertTriangle } from 'lucide-react';
import type { Alert } from '@/types';
import { StatusBadge } from '@/components/atoms/status-badge';
import { eventLabel, fa, faNumber } from '@/lib/i18n';
import { relativeTime } from '@/lib/utils';

export function GatewayAlertsContent({ alerts }: { alerts: Alert[] }) {
  const activeCount = alerts.filter((alert) => !alert.resolvedAt).length;
  return (
    <section>
      <h3 className="m-0 flex items-center gap-2 text-sm font-semibold text-gray-800">
        <AlertTriangle size={16} className="text-red-600" />هشدارهای این درگاه
        <span className="text-xs text-gray-500">({faNumber(alerts.length)})</span>
      </h3>
      <p className="mb-3 mt-1 text-xs text-gray-500">{faNumber(activeCount)} هشدار فعال</p>
      {alerts.length ? (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <article key={alert.id} className="rounded-xl border border-gray-100 bg-white p-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-gray-900">{eventLabel[alert.kind]}</strong>
                <StatusBadge priority={alert.priority} />
              </div>
              <p className="my-1 text-gray-700">{alert.message}</p>
              <span className="text-gray-500">{relativeTime(alert.timestamp)} · {alert.resolvedAt ? fa.alerts.resolved : fa.alerts.opened}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl bg-slate-50 p-3 text-xs text-gray-500">هشداری برای این درگاه ثبت نشده است.</p>
      )}
    </section>
  );
}

export function GatewayAlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <aside className="fixed bottom-3 left-3 top-14 z-[850] hidden w-[320px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl xl:flex" aria-label="هشدارهای درگاه انتخاب‌شده">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="m-0 text-base font-semibold text-gray-900">{fa.alerts.title}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <GatewayAlertsContent alerts={alerts} />
      </div>
    </aside>
  );
}

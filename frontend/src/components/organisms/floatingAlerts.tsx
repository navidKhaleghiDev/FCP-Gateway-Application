import { useGetAlerts } from '@/services/api';
import { useAlertsPanel } from '@/app/alertsContext';
import { LoadingWrapper } from '@/components/molecules/loadingWrapper';
import type { Alert } from '@/types';
import { Bell, BellOff, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/atoms/iconButton';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { useDeviceStore } from '@/stores/deviceStore';
import { eventLabel, fa, faNumber } from '@/lib/i18n';
import { relativeTime } from '@/lib/utils';
import { deviceDetailsPath } from '@/routes/paths';

export function FloatingAlerts() {
  const latestAlert = useDeviceStore((state) => state.latestAlert);

  const {
    alertsOpen: open,
    closeAlerts,
    openAlerts,
    alertsOpenSession: openSession,
  } = useAlertsPanel();

  const {
    data: alerts = [],
    isPending,
    isError,
    refetch,
  } = useGetAlerts(
    {},
    {
      session: openSession,
      enabled: open,
    }
  );

  const activeCount = alerts.filter((alert) => !alert.resolvedAt).length;
  const navigate = useNavigate();

  return (
    <>
      {!open && (
        <div className="fixed left-3 top-3 z-[1200]">
          <IconButton
            label={fa.alerts.title}
            onClick={openAlerts}
            badge={latestAlert && !latestAlert.resolvedAt ? 1 : undefined}
            className="relative h-10 w-10 border-0 bg-transparent text-slate-700 shadow-none hover:bg-transparent hover:text-teal-700"
          >
            <Bell size={20} aria-hidden="true" />
          </IconButton>
        </div>
      )}
      {open && (
        <aside
          className="fixed bottom-24 left-3 right-3 top-14 z-[1200] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-auto sm:w-[380px] md:bottom-3"
          aria-labelledby="floating-alerts-title"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 id="floating-alerts-title" className="m-0 text-base font-semibold text-gray-900">
                {fa.alerts.title}
              </h2>
              <p className="m-0 mt-1 text-xs text-gray-500">
                {faNumber(activeCount)} {fa.alerts.activeCount}
              </p>
            </div>
            <IconButton
              label={fa.alerts.close}
              onClick={() => closeAlerts()}
              className="h-8 w-8 border-0 shadow-none"
            >
              <X size={17} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            <LoadingWrapper
              isLoading={isPending}
              isError={isError}
              onRetry={() => void refetch()}
              compact
            >
              {alerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onOpen={() => {
                    closeAlerts();
                    navigate(deviceDetailsPath(alert.deviceId));
                  }}
                />
              ))}
            </LoadingWrapper>
            {!isPending && !isError && !alerts.length && (
              <div className="grid h-48 place-items-center text-center text-xs text-gray-500">
                <div>
                  <BellOff className="mx-auto mb-2" size={24} />
                  <p>{fa.alerts.empty}</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}

function AlertItem({ alert, onOpen }: { alert: Alert; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-gray-100 p-3 text-right transition hover:border-teal-200 hover:bg-teal-50"
    >
      <span className="flex items-start justify-between gap-2">
        <strong className="text-sm text-gray-900">{eventLabel[alert.kind]}</strong>
        <StatusBadge priority={alert.priority} />
      </span>
      <span className="mt-1 block text-xs text-gray-700">{alert.message}</span>
      <span className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {relativeTime(alert.timestamp)} ·{' '}
          {alert.resolvedAt ? fa.alerts.resolved : fa.alerts.opened}
        </span>
        <ExternalLink size={13} aria-hidden="true" />
      </span>
    </button>
  );
}

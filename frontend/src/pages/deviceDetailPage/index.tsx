import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Battery,
  ChevronLeft,
  Flame,
  PlugZap,
  Radio,
  Signal,
  Thermometer,
  TriangleAlert,
} from 'lucide-react';

import type { EventType, TelemetryPoint } from '@/types';
import { useDeviceStore } from '@/stores/deviceStore';
import { useLiveData } from '@/hooks/useLiveData';
import { Metric } from '@/components/atoms/metric';
import { StatusBadge } from '@/components/atoms/statusBadge';
import { Button } from '@/components/atoms/button';
import { deviceApi } from '@/services/api';
import { toast } from 'sonner';
import { eventLabel, fa, faNumber } from '@/lib/i18n';

export function DeviceDetailsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [pendingAction, setPendingAction] = useState<{ type: EventType; label: string } | null>(
    null
  );

  useLiveData();

  const { id } = useParams();
  const nav = useNavigate();
  const device = useDeviceStore((s) => (id ? s.devices[id] : undefined));

  const requestAction = (type: EventType, label: string) => setPendingAction({ type, label });
  useEffect(() => {
    if (device?.status === 'online')
      setHistory((h) =>
        [
          ...h,
          {
            timestamp: device.lastSeen,
            temperature: device.temperature,
            battery: device.battery,
            signalStrength: device.signalStrength,
          },
        ].slice(-40)
      );
  }, [device?.version]);

  const run = async (eventType: EventType) => {
    if (!id) return;
    setIsRunning(true);
    try {
      await deviceApi.simulate(id, eventType);
      setPendingAction(null);
      toast.success(`سناریوی «${eventLabel[eventType]}» اجرا شد`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'انجام عملیات ناموفق بود');
    } finally {
      setIsRunning(false);
    }
  };

  if (!device)
    return (
      <main className="grid h-screen place-items-center text-slate-400">{fa.details.notFound}</main>
    );

  return (
    <main className="page-shell device-details-page">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            className="h-10 w-10 p-0"
            aria-label={fa.details.back}
            title={fa.details.back}
            onClick={() => nav(-1)}
          >
            <ChevronLeft size={16} />
          </Button>
        </div>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="m-0 text-2xl font-medium text-gray-900">{device.name}</h2>
              <StatusBadge status={device.status} />
              <StatusBadge priority={device.priority} />
            </div>
            <p className="text-sm text-gray-500">
              {device.id} · {device.buildingName}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label={fa.details.battery}
            value={faNumber(Math.round(device.battery))}
            unit="%"
            icon={Battery}
            tone="green"
          />
          <Metric
            label={fa.details.signal}
            value={faNumber(device.signalStrength)}
            unit="dBm"
            icon={Signal}
          />
          <Metric
            label={fa.details.temperature}
            value={faNumber(device.temperature.toFixed(1))}
            unit="°C"
            icon={Thermometer}
            tone={device.temperature > 35 ? 'amber' : 'cyan'}
          />
          <Metric
            label={fa.details.acSupply}
            value={device.acPower ? fa.details.healthy : fa.details.failed}
            icon={PlugZap}
            tone={device.acPower ? 'green' : 'rose'}
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <section className="surface-panel p-5">
            <div className="mb-5">
              <h3 className="m-0 text-sm font-medium text-gray-900">{fa.details.liveTemp}</h3>
              <p className="mt-1 text-xs text-gray-500">{fa.details.history}</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#26384a" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleTimeString([], {
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    }
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0c1c2c',
                      border: '1px solid #26384a',
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#22d3ee"
                    fill="url(#temp)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="surface-panel p-5">
            <h3 className="m-0 text-sm font-medium text-gray-900">{fa.details.operational}</h3>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="space-y-3">
                {[
                  [
                    Radio,
                    fa.details.connectivity,
                    device.status === 'online' ? 'آنلاین' : 'آفلاین',
                  ],
                  [
                    TriangleAlert,
                    fa.details.technicalFault,
                    device.hasFaults ? fa.details.detected : fa.details.clear,
                  ],
                  [
                    Flame,
                    fa.details.urgentAlarm,
                    device.urgentAlarm ? fa.details.active : fa.details.clear,
                  ],
                  [
                    PlugZap,
                    fa.details.acSupply,
                    device.acPower ? fa.details.available : fa.details.unavailable,
                  ],
                ].map(([Icon, label, value]) => (
                  <div
                    key={String(label)}
                    className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                  >
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon size={15} />
                      {label as string}
                    </span>
                    <strong className="text-xs font-medium text-gray-900">{value as string}</strong>
                  </div>
                ))}
              </div>
              <div className="min-w-0 lg:border-r lg:border-gray-200 lg:pr-3">
                <h4 className="mb-3 text-sm font-medium text-gray-900">عملیات درگاه</h4>
                <div className="grid gap-2">
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => requestAction('urgent_alarm', fa.details.testAlarm)}
                  >
                    <Flame size={15} />
                    {fa.details.testAlarm}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => requestAction('technical_fault', fa.details.testFault)}
                  >
                    {fa.details.testFault}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => requestAction('resolve_alarm', fa.details.resolve)}
                  >
                    {fa.details.resolve}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() =>
                      requestAction(
                        device.status === 'online' ? 'disconnect' : 'reconnect',
                        device.status === 'online' ? fa.details.disconnect : fa.details.reconnect
                      )
                    }
                  >
                    {device.status === 'online' ? fa.details.disconnect : fa.details.reconnect}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => requestAction('power_failure', fa.details.powerFailure)}
                  >
                    {fa.details.powerFailure}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {pendingAction && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isRunning) setPendingAction(null);
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="gateway-action-title"
            aria-describedby="gateway-action-description"
            className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h2 id="gateway-action-title" className="m-0 text-lg font-semibold text-gray-900">
              تأیید عملیات
            </h2>
            <p id="gateway-action-description" className="mt-3 text-sm leading-7 text-gray-600">
              آیا از انجام «{pendingAction.label}» برای {device.name} مطمئن هستید؟
            </p>
            <div className="mt-6 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={isRunning}
                onClick={() => setPendingAction(null)}
              >
                انصراف
              </Button>
              <Button
                className="flex-1"
                disabled={isRunning}
                onClick={() => run(pendingAction.type)}
              >
                {isRunning ? 'در حال انجام...' : 'تأیید'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

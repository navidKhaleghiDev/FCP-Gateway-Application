import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Battery,
  ChevronLeft,
  Flame,
  PlugZap,
  Radio,
  Signal,
  Thermometer,
  TriangleAlert,
} from "lucide-react";
import type { EventType, TelemetryPoint } from "@sentinel/shared";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { Metric } from "@/components/atoms/metric";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { deviceApi } from "@/lib/api";
import { toast } from "sonner";
import { eventLabel, fa, faNumber } from "@/lib/i18n";
export function DeviceDetailsPage() {
  useLiveData();
  const { id } = useParams();
  const nav = useNavigate();
  const device = useDeviceStore((s) => (id ? s.devices[id] : undefined));
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  useEffect(() => {
    if (device?.status === "online")
      setHistory((h) =>
        [
          ...h,
          {
            timestamp: device.lastSeen,
            temperature: device.temperature,
            battery: device.battery,
            signalStrength: device.signalStrength,
          },
        ].slice(-40),
      );
  }, [device?.version]);
  const run = async (eventType: EventType) => {
    if (!id) return;
    try {
      await deviceApi.simulate(id, eventType);
      toast.success(`سناریوی «${eventLabel[eventType]}» اجرا شد`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "انجام عملیات ناموفق بود");
    }
  };
  if (!device)
    return (
      <main className="grid h-screen place-items-center text-slate-400">
        {fa.details.notFound}
      </main>
    );
  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 md:pr-[100px]">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" onClick={() => nav(-1)}>
          <ChevronLeft size={16} />
          {fa.details.back}
        </Button>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="m-0 text-2xl font-medium text-gray-900">
                {device.name}
              </h2>
              <StatusBadge status={device.status} />
              <StatusBadge priority={device.priority} />
            </div>
            <p className="text-sm text-gray-500">
              {device.id} · {device.buildingName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => run("urgent_alarm")}>
              <Flame size={15} />
              {fa.details.testAlarm}
            </Button>
            <Button variant="ghost" onClick={() => run("technical_fault")}>
              {fa.details.testFault}
            </Button>
            <Button onClick={() => run("resolve_alarm")}>
              {fa.details.resolve}
            </Button>
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
            tone={device.temperature > 35 ? "amber" : "cyan"}
          />
          <Metric
            label={fa.details.acSupply}
            value={device.acPower ? fa.details.healthy : fa.details.failed}
            icon={PlugZap}
            tone={device.acPower ? "green" : "rose"}
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="m-0 text-sm font-medium text-gray-900">
                {fa.details.liveTemp}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{fa.details.history}</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#22d3ee"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#26384a"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleTimeString([], {
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    }
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0c1c2c",
                      border: "1px solid #26384a",
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
          <section className="rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="m-0 text-sm font-medium text-gray-900">
              {fa.details.operational}
            </h3>
            <div className="mt-5 space-y-3">
              {[
                [
                  Radio,
                  fa.details.connectivity,
                  device.status === "online" ? "آنلاین" : "آفلاین",
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
                  device.acPower
                    ? fa.details.available
                    : fa.details.unavailable,
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
                  <strong className="text-xs font-medium text-gray-900">
                    {value as string}
                  </strong>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  run(device.status === "online" ? "disconnect" : "reconnect")
                }
              >
                {device.status === "online"
                  ? fa.details.disconnect
                  : fa.details.reconnect}
              </Button>
              <Button variant="ghost" onClick={() => run("power_failure")}>
                {fa.details.powerFailure}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

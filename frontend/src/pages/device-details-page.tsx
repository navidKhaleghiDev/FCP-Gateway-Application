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
      toast.success(`Scenario “${eventType.replace("_", " ")}” triggered`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };
  if (!device)
    return (
      <main className="grid h-screen place-items-center text-slate-400">
        Gateway not found
      </main>
    );
  return (
    <main className="min-h-screen px-4 pb-10 pt-24 md:pl-[100px]">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" onClick={() => nav(-1)}>
          <ChevronLeft size={16} />
          Back to fleet
        </Button>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="m-0 text-2xl font-bold">{device.name}</h2>
              <StatusBadge status={device.status} />
              <StatusBadge priority={device.priority} />
            </div>
            <p className="text-sm text-slate-500">
              {device.id} · {device.buildingName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => run("urgent_alarm")}>
              <Flame size={15} />
              Test alarm
            </Button>
            <Button variant="ghost" onClick={() => run("technical_fault")}>
              Test fault
            </Button>
            <Button onClick={() => run("resolve_alarm")}>Resolve all</Button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Battery"
            value={device.battery.toFixed(0)}
            unit="%"
            icon={Battery}
            tone="green"
          />
          <Metric
            label="Signal"
            value={device.signalStrength}
            unit="dBm"
            icon={Signal}
          />
          <Metric
            label="Temperature"
            value={device.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            tone={device.temperature > 35 ? "amber" : "cyan"}
          />
          <Metric
            label="AC power"
            value={device.acPower ? "Healthy" : "Failed"}
            icon={PlugZap}
            tone={device.acPower ? "green" : "rose"}
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <section className="glass rounded-3xl p-5">
            <div className="mb-5">
              <h3 className="m-0 text-sm font-bold">Live temperature</h3>
              <p className="mt-1 text-xs text-slate-500">
                Bounded client-side telemetry history · latest 40 points
              </p>
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
          <section className="glass rounded-3xl p-5">
            <h3 className="m-0 text-sm font-bold">Operational state</h3>
            <div className="mt-5 space-y-3">
              {[
                [Radio, "Connectivity", device.status],
                [
                  TriangleAlert,
                  "Technical faults",
                  device.hasFaults ? "Detected" : "Clear",
                ],
                [
                  Flame,
                  "Urgent alarm",
                  device.urgentAlarm ? "Active" : "Clear",
                ],
                [
                  PlugZap,
                  "AC supply",
                  device.acPower ? "Available" : "Unavailable",
                ],
              ].map(([Icon, label, value]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between rounded-xl bg-white/[.035] p-3"
                >
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <Icon size={15} />
                    {label as string}
                  </span>
                  <strong className="text-xs capitalize text-slate-100">
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
                {device.status === "online" ? "Disconnect" : "Reconnect"}
              </Button>
              <Button variant="ghost" onClick={() => run("power_failure")}>
                Power failure
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

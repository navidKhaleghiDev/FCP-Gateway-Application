import { useMemo } from "react";
import { BellOff, ChevronRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { relativeTime } from "@/lib/utils";
export function AlertsPage() {
  useLiveData();
  const alertRecord = useDeviceStore((state) => state.alerts);
  const alerts = useMemo(
    () =>
      Object.values(alertRecord).sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp),
      ),
    [alertRecord],
  );
  const nav = useNavigate();
  return (
    <main className="min-h-screen px-4 pb-8 pt-24 md:pl-[100px]">
      <section className="glass mx-auto max-w-5xl rounded-3xl p-5">
        <h2 className="m-0 text-lg font-bold">Alert center</h2>
        <p className="mt-1 text-sm text-slate-500">
          Active and recently resolved events
        </p>
        <div className="mt-5 space-y-2">
          {alerts.map((a) => (
            <article
              key={a.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/7 bg-white/[.025] p-4 sm:flex-row sm:items-center"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${a.resolvedAt ? "bg-slate-500/10 text-slate-500" : a.priority === "urgent" ? "bg-rose-500/12 text-rose-300" : "bg-amber-500/12 text-amber-300"}`}
              >
                {a.resolvedAt ? <BellOff size={18} /> : <Clock3 size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-slate-100">
                    {a.message}
                  </strong>
                  <StatusBadge priority={a.priority} />
                </div>
                <p className="my-1 text-xs text-slate-500">
                  {a.deviceId} · {a.kind.replaceAll("_", " ")}
                </p>
                <small className="text-[10px] text-slate-600">
                  {a.resolvedAt
                    ? `Resolved ${relativeTime(a.resolvedAt)}`
                    : `Opened ${relativeTime(a.timestamp)}`}
                </small>
              </div>
              <Button
                variant="ghost"
                onClick={() => nav(`/devices/${a.deviceId}`)}
              >
                Inspect <ChevronRight size={15} />
              </Button>
            </article>
          ))}
          {!alerts.length && (
            <div className="grid h-64 place-items-center text-center text-slate-500">
              <div>
                <BellOff className="mx-auto mb-2" />
                <p>No alerts yet. The network is quiet.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import { Bell, CloudOff, RefreshCw, Wifi } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useDeviceStore } from "@/stores/device-store";
import { cn } from "@/lib/utils";
export function Topbar() {
  const connection = useDeviceStore((s) => s.connection);
  const alertRecord = useDeviceStore((state) => state.alerts);
  const alerts = Object.values(alertRecord).filter((alert) => !alert.resolvedAt);
  const location = useLocation();
  const title =
    location.pathname === "/"
      ? "Live operations map"
      : location.pathname.startsWith("/devices")
        ? "Gateway fleet"
        : "Alert center";
  return (
    <header className="pointer-events-none fixed left-3 right-3 top-3 z-[1000] flex items-center justify-between md:left-[100px]">
      <div className="glass pointer-events-auto rounded-2xl px-4 py-2.5">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[.14em] text-cyan-400">
          Sentinel operations
        </p>
        <h1 className="m-0 text-sm font-bold text-white">{title}</h1>
      </div>
      <div className="glass pointer-events-auto flex h-12 items-center gap-1 rounded-2xl px-2">
        <span
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
            connection === "connected" ? "text-emerald-300" : "text-amber-300",
          )}
        >
          {connection === "connected" ? (
            <Wifi size={15} />
          ) : connection === "offline" ? (
            <CloudOff size={15} />
          ) : (
            <RefreshCw className="animate-spin" size={15} />
          )}
          <span className="hidden sm:inline">{connection}</span>
        </span>
        <div className="h-5 w-px bg-white/10" />
        <button className="relative rounded-xl p-2 text-slate-300 hover:bg-white/5">
          <Bell size={18} />
          {alerts.length > 0 && (
            <b className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
              {alerts.length}
            </b>
          )}
        </button>
        <div className="ml-1 grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-xs font-bold text-slate-950">
          OP
        </div>
      </div>
    </header>
  );
}

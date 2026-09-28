import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { SearchField } from "@/components/molecules/search-field";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { relativeTime } from "@/lib/utils";
const PAGE_SIZE = 15;
export function DevicesPage() {
  useLiveData();
  const deviceRecord = useDeviceStore((state) => state.devices);
  const devices = useMemo(() => Object.values(deviceRecord), [deviceRecord]);
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const rows = useMemo(
    () =>
      devices
        .filter(
          (d) =>
            (!query ||
              `${d.name} ${d.id} ${d.buildingName}`
                .toLowerCase()
                .includes(query.toLowerCase())) &&
            (status === "all" || d.status === status) &&
            (priority === "all" || d.priority === priority),
        )
        .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)),
    [devices, query, status, priority],
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };
  return (
    <main className="min-h-screen px-4 pb-8 pt-24 md:pl-[100px]">
      <div className="mx-auto max-w-[1450px]">
        <section className="glass rounded-3xl">
          <div className="flex flex-col gap-3 border-b border-white/8 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="m-0 text-lg font-bold">Gateway fleet</h2>
              <p className="mt-1 text-sm text-slate-500">
                Live operational state for {devices.length} devices
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-72">
                <SearchField
                  value={query}
                  onChange={update(setQuery)}
                  placeholder="Search name, ID, building…"
                />
              </div>
              <select
                value={status}
                onChange={(e) => update(setStatus)(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-[#0c1c2c] px-3 text-sm text-slate-300"
              >
                <option value="all">All statuses</option>
                <option>online</option>
                <option>offline</option>
              </select>
              <select
                value={priority}
                onChange={(e) => update(setPriority)(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-[#0c1c2c] px-3 text-sm text-slate-300"
              >
                <option value="all">All priorities</option>
                <option>normal</option>
                <option>warning</option>
                <option>urgent</option>
              </select>
            </div>
          </div>
          <div className="scrollbar overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                  {[
                    "Gateway",
                    "Building",
                    "Status",
                    "Priority",
                    "Battery",
                    "Signal",
                    "Temperature",
                    "Last seen",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border-b border-white/8 px-5 py-3 font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-white/[.055] transition hover:bg-white/[.025]"
                  >
                    <td className="px-5 py-3">
                      <strong className="block text-slate-100">{d.name}</strong>
                      <span className="text-xs text-slate-500">{d.id}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {d.buildingName}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge priority={d.priority} />
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {d.battery.toFixed(0)}%
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {d.signalStrength} dBm
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {d.temperature.toFixed(1)}°C
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {relativeTime(d.lastSeen)}
                    </td>
                    <td className="px-5 py-3">
                      <Button
                        variant="ghost"
                        onClick={() => nav(`/devices/${d.id}`)}
                      >
                        <Eye size={15} />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <div className="grid h-64 place-items-center text-slate-500">
                <div className="text-center">
                  <Search className="mx-auto mb-2" />
                  <p>No matching gateways</p>
                </div>
              </div>
            )}
          </div>
          <footer className="flex items-center justify-between p-4 text-xs text-slate-500">
            <span>
              Showing {visible.length} of {rows.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={15} />
              </Button>
              <span>
                Page {page} of {pages}
              </span>
              <Button
                variant="ghost"
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={15} />
              </Button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

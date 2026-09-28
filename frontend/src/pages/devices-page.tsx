import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeviceStore } from "@/stores/device-store";
import { useLiveData } from "@/hooks/use-live-data";
import { SearchField } from "@/components/molecules/search-field";
import { StatusBadge } from "@/components/atoms/status-badge";
import { Button } from "@/components/atoms/button";
import { relativeTime } from "@/lib/utils";
import { fa, faNumber } from "@/lib/i18n";
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
    <main className="min-h-screen bg-gray-50 px-4 pb-8 pt-24 md:pr-[100px]">
      <div className="mx-auto max-w-[1450px]">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="m-0 text-lg font-medium text-gray-900">
                {fa.fleet.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {fa.fleet.subtitle} برای {faNumber(devices.length)} دستگاه
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-72">
                <SearchField
                  value={query}
                  onChange={update(setQuery)}
                  placeholder={fa.fleet.search}
                />
              </div>
              <select
                value={status}
                onChange={(e) => update(setStatus)(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-teal-500"
              >
                <option value="all">{fa.fleet.allStatus}</option>
                <option value="online">آنلاین</option>
                <option value="offline">آفلاین</option>
              </select>
              <select
                value={priority}
                onChange={(e) => update(setPriority)(e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-teal-500"
              >
                <option value="all">{fa.fleet.allPriority}</option>
                <option value="normal">عادی</option>
                <option value="warning">هشدار</option>
                <option value="urgent">فوری</option>
              </select>
            </div>
          </div>
          <div className="scrollbar overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-right text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs text-gray-500">
                  {[
                    fa.fleet.gateway,
                    fa.fleet.building,
                    fa.fleet.status,
                    fa.fleet.priority,
                    fa.fleet.battery,
                    fa.fleet.signal,
                    fa.fleet.temperature,
                    fa.fleet.lastSeen,
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border-b border-gray-200 px-5 py-3 font-medium"
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
                    className="border-b border-gray-200 transition hover:bg-gray-100"
                  >
                    <td className="px-5 py-3">
                      <strong className="block font-medium text-gray-900">
                        {d.name}
                      </strong>
                      <span className="text-xs text-gray-500" dir="ltr">
                        {d.id}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {d.buildingName}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge priority={d.priority} />
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {faNumber(Math.round(d.battery))}٪
                    </td>
                    <td className="px-5 py-3 text-gray-700" dir="ltr">
                      {faNumber(d.signalStrength)} dBm
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {faNumber(d.temperature.toFixed(1))}°C
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {relativeTime(d.lastSeen)}
                    </td>
                    <td className="px-5 py-3">
                      <Button
                        variant="ghost"
                        onClick={() => nav(`/devices/${d.id}`)}
                      >
                        <Eye size={15} />
                        {fa.common.view}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <div className="grid h-64 place-items-center text-gray-500">
                <div className="text-center">
                  <Search className="mx-auto mb-2" />
                  <p>{fa.fleet.noResult}</p>
                </div>
              </div>
            )}
          </div>
          <footer className="flex items-center justify-between p-4 text-xs text-gray-500">
            <span>
              {fa.fleet.showing} {faNumber(visible.length)} {fa.common.of}{" "}
              {faNumber(rows.length)}
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
                {fa.common.page} {faNumber(page)} {fa.common.of}{" "}
                {faNumber(pages)}
              </span>
              <Button
                variant="ghost"
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="rotate-180" size={15} />
              </Button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

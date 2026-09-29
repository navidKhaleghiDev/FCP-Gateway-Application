import { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import type { DevicePriority, DeviceStatus } from '@sentinel/shared';
import { useNavigate } from 'react-router-dom';
import { useDeviceStore } from '@/stores/device-store';
import { useLiveData } from '@/hooks/use-live-data';
import { SearchField } from '@/components/molecules/search-field';
import { Select } from '@/components/atoms/select';
import { Button } from '@/components/atoms/button';
import { StatusBadge } from '@/components/atoms/status-badge';
import { Pagination } from '@/components/molecules/pagination';
import { DeviceTable } from '@/components/organisms/device-table';
import { fa, faNumber } from '@/lib/i18n';
import { APP_CONFIG } from '@/config/app';
import { deviceDetailsPath } from '@/routes/paths';
import { relativeTime } from '@/lib/utils';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

const FILTER_DEFAULTS = { query: '', status: 'all', priority: 'all', page: '1' };

export function DevicesPage() {
  useLiveData();
  const deviceRecord = useDeviceStore((state) => state.devices);
  const devices = useMemo(() => Object.values(deviceRecord), [deviceRecord]);
  const nav = useNavigate();

  const [{ query, status, priority, page }, setUrlState] = useQueryStates(
    {
      query: parseAsString.withDefault(FILTER_DEFAULTS.query),
      status: parseAsString.withDefault(FILTER_DEFAULTS.status),
      priority: parseAsString.withDefault(FILTER_DEFAULTS.priority),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const rows = useMemo(
    () =>
      devices
        .filter(
          (d) =>
            (!query ||
              `${d.name} ${d.id} ${d.buildingName}`.toLowerCase().includes(query.toLowerCase())) &&
            (status === 'all' || d.status === (status as DeviceStatus)) &&
            (priority === 'all' || d.priority === (priority as DevicePriority))
        )
        .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen)),
    [devices, query, status, priority]
  );

  const pages = Math.max(1, Math.ceil(rows.length / APP_CONFIG.devicesPageSize));
  const currentPage = Math.min(page, pages);
  const visible = rows.slice(
    (currentPage - 1) * APP_CONFIG.devicesPageSize,
    currentPage * APP_CONFIG.devicesPageSize
  );
  const updateFilter = (key: 'query' | 'status' | 'priority', value: string) =>
    setUrlState({ [key]: value, page: 1 });

  useEffect(() => {
    if (page !== currentPage) setUrlState({ page: currentPage });
  }, [currentPage, page, setUrlState]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 pb-8 pt-24 md:pr-[100px]">
      <div className="mx-auto max-w-[1450px]">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="m-0 text-lg font-medium text-gray-900">{fa.fleet.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {fa.fleet.subtitle} برای {faNumber(devices.length)} دستگاه
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="w-full sm:w-72">
                <SearchField
                  value={query}
                  onChange={(value) => updateFilter('query', value)}
                  placeholder={fa.fleet.search}
                />
              </div>
              <Select
                options={[]}
                value={status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-teal-500"
              >
                <option value="all">{fa.fleet.allStatus}</option>
                <option value="online">آنلاین</option>
                <option value="offline">آفلاین</option>
              </Select>
              <Select
                options={[]}
                value={priority}
                onChange={(e) => updateFilter('priority', e.target.value)}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-teal-500"
              >
                <option value="all">{fa.fleet.allPriority}</option>
                <option value="normal">عادی</option>
                <option value="warning">هشدار</option>
                <option value="urgent">فوری</option>
              </Select>
            </div>
          </div>
          <div className="scrollbar overflow-x-auto">
            <DeviceTable devices={visible} onView={(id) => nav(deviceDetailsPath(id))} />
            <table className="hidden w-full min-w-[1000px] border-collapse text-right text-sm">
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
                    '',
                  ].map((h) => (
                    <th key={h} className="border-b border-gray-200 px-5 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id} className="border-b border-gray-200 transition hover:bg-gray-100">
                    <td className="px-5 py-3">
                      <strong className="block font-medium text-gray-900">{d.name}</strong>
                      <span className="text-xs text-gray-500" dir="ltr">
                        {d.id}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{d.buildingName}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge priority={d.priority} />
                    </td>
                    <td className="px-5 py-3 text-gray-700">{faNumber(Math.round(d.battery))}٪</td>
                    <td className="px-5 py-3 text-gray-700" dir="ltr">
                      {faNumber(d.signalStrength)} dBm
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {faNumber(d.temperature.toFixed(1))}°C
                    </td>
                    <td className="px-5 py-3 text-gray-500">{relativeTime(d.lastSeen)}</td>
                    <td className="px-5 py-3">
                      <Button variant="ghost" onClick={() => nav(`/devices/${d.id}`)}>
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
              {fa.fleet.showing} {faNumber(visible.length)} {fa.common.of} {faNumber(rows.length)}
            </span>
            <Pagination
              page={currentPage}
              totalItems={rows.length}
              pageSize={APP_CONFIG.devicesPageSize}
              onPageChange={(nextPage) => setUrlState({ page: nextPage })}
            />
            <div className="hidden items-center gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setUrlState({ page: currentPage - 1 })}
              >
                <ChevronLeft size={15} />
              </Button>
              <span>
                {fa.common.page} {faNumber(currentPage)} {fa.common.of} {faNumber(pages)}
              </span>
              <Button
                variant="ghost"
                disabled={page === pages}
                onClick={() => setUrlState({ page: currentPage + 1 })}
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

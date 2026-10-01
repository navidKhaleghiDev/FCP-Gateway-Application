import { useEffect } from 'react';
import { CircleX, RadioTower, Search, TriangleAlert, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetDevices } from '@/services/api';
import { SearchField } from '@/components/molecules/searchField';
import { KpiCard } from '@/components/molecules/kpiCard';
import { Pagination } from '@/components/molecules/pagination';
import { DeviceTable } from '@/components/organisms/deviceTable';


import { fa, faNumber } from '@/lib/i18n';
import { APP_CONFIG } from '@/config/app';
import { deviceDetailsPath } from '@/routes/paths';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

export function DevicesPage() {
  const nav = useNavigate();

  const [{ query, page }, setUrlState] = useQueryStates(
    {
      query: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    { history: 'replace', clearOnDefault: true }
  );
  const { data: result } = useGetDevices({ search: query });
  const rows = result?.data ?? [];
  const summary = result?.meta.summary;
  const pages = Math.max(1, Math.ceil(rows.length / APP_CONFIG.devicesPageSize));
  const currentPage = Math.min(page, pages);
  const visible = rows.slice(
    (currentPage - 1) * APP_CONFIG.devicesPageSize,
    currentPage * APP_CONFIG.devicesPageSize
  );
  useEffect(() => {
    if (page !== currentPage) setUrlState({ page: currentPage });
  }, [currentPage, page, setUrlState]);

  return (
    <main className="page-shell gateways-page">


      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col">
        <div className="mb-6 grid shrink-0 grid-cols-2 gap-3 md:mb-10 xl:mb-12 xl:grid-cols-4">
          <KpiCard label="کل درگاه‌ها" value={summary?.total ?? 0} icon={RadioTower} tone="bg-slate-100 text-slate-700" />
          <KpiCard label="درگاه‌های فعال" value={summary?.online ?? 0} icon={Wifi} tone="bg-teal-50 text-teal-600" />
          <KpiCard label="درگاه‌های دارای هشدار" value={summary?.warnings ?? 0} icon={TriangleAlert} tone="bg-amber-50 text-amber-600" />
          <KpiCard label="درگاه‌های دارای خطا" value={summary?.errors ?? 0} icon={CircleX} tone="bg-red-50 text-red-600" />
        </div>
        <section className="surface-panel flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-gray-200 px-5 py-4 lg:px-6">
            <div className="w-full sm:w-[360px]">
              <SearchField
                value={query}
                onChange={(value) => setUrlState({ query: value, page: 1 })}
                placeholder={fa.fleet.search}
              />
            </div>
          </div>
          <div className="scrollbar min-h-0 flex-1 overflow-auto">
            <DeviceTable devices={visible} onView={(id) => nav(deviceDetailsPath(id))} />
            {!visible.length && (
              <div className="grid h-64 place-items-center text-gray-500">
                <div className="text-center">
                  <Search className="mx-auto mb-2" />
                  <p>{fa.fleet.noResult}</p>
                </div>
              </div>
            )}
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4 text-xs text-gray-500">
            <span>
              {fa.fleet.showing} {faNumber(visible.length)} {fa.common.of} {faNumber(rows.length)}
            </span>
            <Pagination
              page={currentPage}
              totalItems={rows.length}
              pageSize={APP_CONFIG.devicesPageSize}
              onPageChange={(nextPage) => setUrlState({ page: nextPage })}
            />
          </footer>
        </section>
      </div>
    </main>
  );
}

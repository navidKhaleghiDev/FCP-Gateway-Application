import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';
import { FloatingAlerts } from '@/components/organisms/floating-alerts';
import { Loading } from '@/components/atoms/loading';
import { fa } from '@/lib/i18n';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

export function App() {
  return (
    <NuqsAdapter>
      <Sidebar />
      <Topbar />
      <FloatingAlerts />
      <Suspense
        fallback={
          <>
            <Loading className="h-screen bg-gray-50" label={fa.map.loading} />
            <div className="hidden">در حال بارگذاری سامانه…</div>
          </>
        }
      >
        <Outlet />
      </Suspense>
    </NuqsAdapter>
  );
}

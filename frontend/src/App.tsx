import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/components/organisms/sidebar';
import { Navbar } from '@/components/organisms/Navbar';
import { FloatingAlerts } from '@/components/organisms/floatingAlerts';
import { Loading } from '@/components/atoms/loading';
import { fa } from '@/lib/i18n';
import { useSocketEvent } from '@/services/useSocketEvent';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';

export function App() {
  useSocketEvent();
  return (
    <NuqsAdapter>
      <Sidebar />
      <Navbar />
      <FloatingAlerts />
      <Suspense fallback={<Loading className="h-screen bg-gray-50" label={fa.map.loading} />}>
        <Outlet />
      </Suspense>
    </NuqsAdapter>
  );
}

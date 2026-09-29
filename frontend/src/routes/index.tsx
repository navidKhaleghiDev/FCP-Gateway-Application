import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { ROUTES } from '@/routes/paths';
import { Loading } from '@/components/atoms/loading';
import { fa } from '@/lib/i18n';

export const router = createBrowserRouter([
  {
    element: <App />,
    HydrateFallback: () => <Loading className="h-screen bg-gray-50" label={fa.map.loading} />,
    children: [
      {
        path: ROUTES.HOME,
        lazy: async () => {
          const { MapPage } = await import('@/pages/map-page');
          return { Component: MapPage };
        },
      },
      {
        path: ROUTES.DEVICES,
        lazy: async () => {
          const { DevicesPage } = await import('@/pages/devices-page');
          return { Component: DevicesPage };
        },
      },
      {
        path: ROUTES.DEVICE_DETAILS,
        lazy: async () => {
          const { DeviceDetailsPage } = await import('@/pages/device-details-page');
          return { Component: DeviceDetailsPage };
        
        },
      },
      {
        path: ROUTES.ALERTS,
        lazy: async () => {
          const { AlertsPage } = await import('@/pages/alerts-page');
          return { Component: AlertsPage };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/pages/not-found-page');
          return { Component: NotFoundPage };
        },
      },
    ],
  },
]);

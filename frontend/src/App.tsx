import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Sidebar } from "@/components/organisms/sidebar";
import { Topbar } from "@/components/organisms/topbar";


const MapPage = lazy(() =>
  import("@/pages/map-page").then((m) => ({ default: m.MapPage })),
);
const DevicesPage = lazy(() =>
  import("@/pages/devices-page").then((m) => ({ default: m.DevicesPage })),
);
const DeviceDetailsPage = lazy(() =>
  import("@/pages/device-details-page").then((m) => ({
    default: m.DeviceDetailsPage,
  })),
);
const AlertsPage = lazy(() =>
  import("@/pages/alerts-page").then((m) => ({ default: m.AlertsPage })),
);

export function App() {
  return (
    <>
      <Sidebar />
      <Topbar />
      {/* TODO : For the loading that we have here add component in the atoms that is Loading and use the custom spinner
      also for the loading and this component add like <LoadingWrapper/>  */}
      <Suspense
        fallback={
          <div className="grid h-screen place-items-center bg-gray-50 text-sm text-teal-600">
            در حال بارگذاری سامانه…
          </div>
        }
      >
        {/* TODO : For the creating the route also use the function createBrowserRouter from the react router use this in action for us 
        and also create new directory named routes in the src and put the constance for that there for us , also handle the notFound page for us there for me 
        also all the routs that we have there should be constance beside them like this exm : HOME = "/" */}
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/devices/:id" element={<DeviceDetailsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="*" element={<MapPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

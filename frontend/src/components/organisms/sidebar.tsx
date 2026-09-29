import { Activity, AlertTriangle, Map, PanelLeftClose, RadioTower, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { fa } from '@/lib/i18n';
const items = [
  { to: '/', label: fa.nav.map, icon: Map },
  { to: '/devices', label: fa.nav.devices, icon: RadioTower },
  { to: '/alerts', label: fa.nav.alerts, icon: AlertTriangle },
];

/**
 * Renders the primary application navigation sidebar.
 * @component
 * @returns {JSX.Element} The application sidebar.
 */


export function Sidebar() {
  return (
    <aside className="fixed bottom-3 right-3 top-3 z-[1100] hidden w-[76px] flex-col items-center rounded-[1.5rem] border border-gray-200 bg-white py-4 shadow-sm md:flex">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-600">
        <Activity size={23} strokeWidth={2.7} />
      </div>
      <nav className="mt-8 flex w-full flex-1 flex-col gap-2 px-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              cn(
                'group relative grid h-10 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800',
                isActive && 'bg-teal-50 text-teal-600'
              )
            }
          >
            <Icon size={20} />
            <span className="pointer-events-none absolute right-[58px] hidden whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white shadow-md group-hover:block">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
      <button
        title={fa.nav.settings}
        className="grid h-10 w-10 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      >
        <Settings size={19} />
      </button>
      <button
        title={fa.nav.collapse}
        className="mt-1 grid h-10 w-10 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      >
        <PanelLeftClose size={19} />
      </button>
    </aside>
  );
}

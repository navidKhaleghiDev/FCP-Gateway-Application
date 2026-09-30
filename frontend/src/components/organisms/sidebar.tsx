import { AlertTriangle, Map, RadioTower } from 'lucide-react';
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
    <aside className="fixed bottom-3 left-3 right-3 z-[1100] flex h-16 items-center rounded-2xl border border-gray-200 bg-white/95 px-2 shadow-lg backdrop-blur md:bottom-3 md:left-auto md:top-3 md:h-auto md:w-14 md:flex-col md:rounded-2xl md:py-3">
      <nav className="flex w-full flex-1 items-center gap-2 md:flex-col md:items-stretch md:px-1" aria-label="ناوبری اصلی">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              cn(
                'group relative flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 md:h-10 md:flex-none',
                isActive && 'bg-teal-50 font-semibold text-teal-700'
              )
            }
          >
            <Icon size={18} />
            <span className="text-xs md:hidden">{label}</span>
            <span className="pointer-events-none absolute right-[44px] hidden whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white shadow-md group-hover:block">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

import type { LucideIcon } from 'lucide-react';

interface IProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  caption?: string;
}

/**
 * Summarizes a single fleet KPI with a contextual icon and caption.
 *
 * @component
 * @param {IProps} props - KPI content and presentation options.
 * @param {string} props.label - KPI label.
 * @param {number} props.value - Numeric KPI value.
 * @param {LucideIcon} props.icon - KPI icon.
 * @param {string} props.tone - Utility classes for the icon background.
 * @param {string} props.caption - Supporting caption.
 * @returns {JSX.Element} A KPI card.
 */

export function KpiCard({ label, value, icon: Icon, tone, caption }: IProps) {
  return (
    <div className="surface-panel min-w-0 p-4 text-right">
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-xs font-medium text-gray-500">{label}</p>
          <p className="mb-0 mt-2 text-2xl font-semibold text-gray-900">
            {new Intl.NumberFormat('fa-IR').format(value)}
          </p>
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
      {caption && (
        <p className="mb-0 mt-2 text-[clamp(10px,0.75vw,11px)] text-gray-400">{caption}</p>
      )}
    </div>
  );
}

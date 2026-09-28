import type { LucideIcon } from "lucide-react";

interface IProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  caption: string;
}

// TODO : also for this compnent add the js doc for 


export function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  caption,
}:IProps) {
  return (
    <div className="glass min-w-[165px] rounded-lg p-4 text-right">
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-xs font-medium text-gray-500">{label}</p>
          <p className="my-1 text-2xl font-medium text-gray-900">
            {new Intl.NumberFormat("fa-IR").format(value)}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="m-0 text-[11px] text-gray-400">{caption}</p>
    </div>
  );
}

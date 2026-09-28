import type { LucideIcon } from "lucide-react";
export function Metric({
  label,
  value,
  unit,
  icon: Icon,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tone?: "cyan" | "green" | "amber" | "rose";
}) {
  const color = {
    cyan: "text-teal-600 bg-teal-50",
    green: "text-teal-600 bg-teal-50",
    amber: "text-amber-600 bg-amber-100",
    rose: "text-red-600 bg-red-100",
  }[tone];
  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className={`rounded-lg p-1.5 ${color}`}>
          <Icon size={15} />
        </span>
      </div>
      <div className="mt-2 text-xl font-medium text-gray-900">
        {value}
        <small className="mr-1 text-xs font-medium text-gray-500">{unit}</small>
      </div>
    </div>
  );
}

import type { DevicePriority, DeviceStatus } from "@sentinel/shared";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/i18n";
export function StatusBadge({
  status,
  priority,
}: {
  status?: DeviceStatus;
  priority?: DevicePriority;
}) {
  const value = status ?? priority ?? "normal";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium",
        value === "normal" && "bg-teal-50 text-teal-600",
        value === "online" && "bg-teal-50 text-teal-600",
        value === "warning" && "bg-amber-100 text-amber-700",
        value === "urgent" && "bg-red-100 text-red-600",
        value === "offline" && "bg-gray-100 text-gray-500",
      )}
    >
      <i className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(value)}
    </span>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const relativeTime = (iso: string) => {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 5) return "همین حالا";
  const formatter = new Intl.RelativeTimeFormat("fa-IR", { numeric: "always" });
  if (seconds < 60) return formatter.format(-seconds, "second");
  if (seconds < 3600)
    return formatter.format(-Math.floor(seconds / 60), "minute");
  return formatter.format(-Math.floor(seconds / 3600), "hour");
};

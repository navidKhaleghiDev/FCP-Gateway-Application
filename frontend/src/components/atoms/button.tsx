import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";


interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger";
  className ?: string
} 

// TODO : add for this component jsdoc



export function Button({
  className,
  variant = "default",
  ...props
}:IProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-40",
        variant === "default" &&
          "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700",
        variant === "ghost" &&
          "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        variant === "danger" && "bg-red-500 text-white hover:bg-red-600",
        className,
      )}
      {...props}
    />
  );
}

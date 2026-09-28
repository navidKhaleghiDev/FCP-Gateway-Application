import { Search, X } from "lucide-react";
import { fa } from "@/lib/i18n";
export function SearchField({
  value,
  onChange,
  placeholder = fa.map.search,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block">
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-10 text-right text-sm text-gray-800 outline-none placeholder:text-right placeholder:text-gray-400 hover:border-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
      />
      {value && (
        <button
          aria-label="پاک کردن جست‌وجو"
          onClick={() => onChange("")}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}

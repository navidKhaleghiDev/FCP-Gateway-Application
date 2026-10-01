import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { fa } from '@/lib/i18n';
import { APP_CONFIG } from '@/config/app';
import { useDebounce } from '@/hooks/use-debounce';

interface IProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

/**
 * Search input that debounces changes to avoid excessive filtering or requests.
 *
 * @component
 * @param {IProps} props - Controlled search input props.
 * @param {string} props.value - Current committed search value.
 * @param {(value: string) => void} props.onChange - Debounced value callback.
 * @param {string} [props.placeholder] - Input placeholder text.
 * @returns {JSX.Element} A debounced search field.
 */

export function SearchField({ value, onChange, placeholder = fa.map.search }: IProps) {
  const [draft, setDraft] = useState(value);
  const debouncedDraft = useDebounce(draft, APP_CONFIG.searchDebounceMs);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (debouncedDraft !== value) onChange(debouncedDraft);
  }, [debouncedDraft, onChange, value]);

  const clear = () => {
    setDraft('');
  };
  return (
    <label className="relative block">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        className="search-field-input h-10 w-full rounded-lg border-0 bg-slate-50 pl-9 pr-10 text-right text-sm text-gray-800 outline-none placeholder:text-right placeholder:text-gray-400"
      />
      {draft && (
        <button
          aria-label="پاک کردن جست‌وجو"
          type="button"
          onClick={clear}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}

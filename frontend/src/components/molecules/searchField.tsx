import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { FocusEventHandler, KeyboardEventHandler } from 'react';
import { cn } from '@/lib/utils';
import { fa } from '@/lib/i18n';
import { APP_CONFIG } from '@/config/app';
import { useDebounce } from '@/hooks/useDebounce';

interface IProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  variant?: 'default' | 'map';
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onClear?: () => void;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
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

export function SearchField({
  value,
  onChange,
  placeholder = fa.map.search,
  variant = 'default',
  onFocus,
  onKeyDown,
  onClear,
  ariaLabel,
  ariaExpanded,
  ariaControls,
}: IProps) {
  const [draft, setDraft] = useState(value);
  const debouncedDraft = useDebounce(draft, APP_CONFIG.searchDebounceMs);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (debouncedDraft !== value) onChange(debouncedDraft);
  }, [debouncedDraft, onChange, value]);

  const clear = () => {
    setDraft('');
    onClear?.();
  };
  return (
    <div className="relative">
      <Search
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400',
          variant === 'map' && 'text-teal-600'
        )}
        size={16}
        aria-hidden="true"
      />
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        className={cn(
          'search-field-input h-10 w-full rounded-lg border-0 bg-slate-50 pl-9 pr-10 text-right text-sm text-gray-800 outline-none placeholder:text-right placeholder:text-gray-400',
          variant === 'map' && 'h-9 rounded-full border border-white bg-white text-xs shadow-md'
        )}
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
    </div>
  );
}

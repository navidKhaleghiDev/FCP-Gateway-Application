import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
}

/**
 * Styled native select with keyboard and screen-reader support.
 *
 * @component
 * @param {SelectProps} props - Native select props and option definitions.
 * @param {readonly SelectOption[]} props.options - Options displayed in the select.
 * @param {string} [props.className] - Additional utility classes.
 * @returns {JSX.Element} A styled select element.
 */

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none hover:border-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  label?: string;
  className?: string;
}

/**
 * Displays an accessible, centered loading spinner.
 *
 * @component
 * @param {LoadingProps} props - Loading display options.
 * @param {string} [props.label] - Status text announced to assistive technology.
 * @param {string} [props.className] - Additional utility classes.
 * @returns {JSX.Element} A live loading status element.
 */
export function Loading({ label, className }: LoadingProps) {
  return (
    <div
      className={cn('grid place-items-center text-sm text-teal-600', className)}
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-2">
        <LoaderCircle className="animate-spin" size={20} aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

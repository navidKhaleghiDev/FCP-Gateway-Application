import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Loading } from '@/components/atoms/loading';
import { fa } from '@/lib/i18n';

interface LoadingWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  loadingLabel?: string;
  compact?: boolean;
}

/**
 * Renders consistent loading and error states around asynchronous content.
 *
 * @component
 * @param {LoadingWrapperProps} props - Async state and fallback content.
 * @param {ReactNode} props.children - Content rendered when the request succeeds.
 * @param {boolean} props.isLoading - Whether loading UI should be displayed.
 * @param {boolean} [props.isError=false] - Whether error UI should be displayed.
 * @param {() => void} [props.onRetry] - Retry callback for the error action.
 * @param {string} [props.loadingLabel] - Loading status text.
 * @returns {JSX.Element} Content or the matching async state.
 */


export function LoadingWrapper({
  children,
  isLoading,
  isError = false,
  onRetry,
  loadingLabel = fa.map.loading,
  compact = false,
}: LoadingWrapperProps) {
  if (isError) {
    return (
      <div className={compact ? "grid min-h-32 place-items-center" : "grid min-h-screen place-items-center"}>
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-3 text-red-500" />
          <h2>{fa.map.loadError}</h2>
          {onRetry && <Button onClick={onRetry}>{fa.common.retry}</Button>}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading className={compact ? "min-h-32" : "min-h-screen bg-gray-50"} label={loadingLabel} />;
  }

  return children;
}

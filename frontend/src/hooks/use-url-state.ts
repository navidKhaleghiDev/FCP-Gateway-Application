import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

type UrlState = Record<string, string>;

/**
 * Reads selected query parameters and updates them without discarding unrelated parameters.
 *
 * @template T URL state shape. Every state value must be a string.
 * @param {T} defaults - Fallback values used when a query parameter is missing.
 * @returns {[T, (updates: Partial<T>) => void]} Current parsed state and an updater.
 */
export function useUrlState<T extends UrlState>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [key, searchParams.get(key) || fallback])
  ) as T;

  const updateUrlState = useCallback(
    (updates: Partial<T>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(updates).forEach(([key, value]) => {
            if (!value || value === defaults[key]) next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace: true }
      );
    },
    [defaults, setSearchParams]
  );

  return [state, updateUrlState] as const;
}

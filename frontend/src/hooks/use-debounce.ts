import { useEffect, useState } from 'react';

/**
 * Delays a value update until it has remained unchanged for the given duration.
 *
 * @template T Value type.
 * @param {T} value - Value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

'use client';

import { useEffect, useState } from 'react';

/** Returns `value` once it has stopped changing for `delayMs` — use it to avoid filtering or fetching on every keystroke. */
export function useDebouncedValue<T>(value: T, delayMs = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

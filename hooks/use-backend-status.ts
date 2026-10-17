'use client';

import { useEffect, useState } from 'react';
import { checkBackendReachable } from '@/lib/health-check';
import { BACKEND_PROBE_URL } from '@/lib/api/client';

export type BackendStatus = 'checking' | 'online' | 'blocked';

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    checkBackendReachable(BACKEND_PROBE_URL).then((result) => {
      if (!cancelled) setStatus(result.reachable ? 'online' : 'blocked');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}

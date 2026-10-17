'use client';

import { useEffect } from 'react';
import { trackVisit } from '@/lib/api/visitors';

export function useTrackVisit(page: string) {
  useEffect(() => {
    trackVisit({
      page,
      url: window.location.href,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).catch(() => {});
  }, [page]);
}

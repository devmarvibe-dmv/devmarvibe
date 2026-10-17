'use client';

import { useEffect } from 'react';
import { detectDeviceType, trackVisit } from '@/lib/api/visitors';

export function useTrackVisit(page: string) {
  useEffect(() => {
    trackVisit({
      page,
      url: window.location.href,
      deviceType: detectDeviceType(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).catch(() => {});
  }, [page]);
}

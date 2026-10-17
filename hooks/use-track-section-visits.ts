'use client';

import { useEffect, useRef } from 'react';
import { trackVisit } from '@/lib/api/visitors';

export function useTrackSectionVisits(sectionIds: string[]) {
  const seen = useRef<Set<string>>(new Set());
  const key = sectionIds.join(',');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && !seen.current.has(id)) {
          seen.current.add(id);
          trackVisit({
            page: id,
            url: window.location.href,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }).catch(() => {});
        }
      });
    }, { threshold: 0.4 });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

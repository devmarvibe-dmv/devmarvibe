'use client';

import { useTrackVisit } from '@/hooks/use-track-visit';

/** Records a page view in the console's visitor analytics; lets server-rendered pages track visits. */
export function TrackVisit({ page }: { page: string }) {
  useTrackVisit(page);
  return null;
}

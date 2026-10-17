import { apiClient, type ApiEnvelope } from './client';

export type VisitPayload = {
  page: string;
  url: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
};

type VisitorCount = {
  accode: string;
  page: string | null;
  total: number;
};

/** Total visits (one per visitor per day), optionally only those that opened `page`. */
export async function getVisitorCount(page?: string): Promise<number> {
  const { data } = await apiClient.get<ApiEnvelope<VisitorCount>>('/visitors/count', { params: page ? { page } : undefined });
  return data.data.total;
}

/** Call once per page view; same-day views from one visitor are merged by the console. */
export async function trackVisit(payload: VisitPayload): Promise<void> {
  await apiClient.post('/visitors/post', payload);
}

export function detectDeviceType(): VisitPayload['deviceType'] {
  if (typeof window === 'undefined') return undefined;
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

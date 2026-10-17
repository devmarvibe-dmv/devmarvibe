import { createApiClient } from './client';

const visitorsApi = createApiClient('https://console.devmarvibe.com/api/visitors');

export type VisitorCount = {
  count: number;
};

export type VisitPayload = {
  page: string;
  url: string;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
};

export async function getVisitorCount(): Promise<number> {
  const { data } = await visitorsApi.get<VisitorCount>('/count');
  return data.count;
}

export async function trackVisit(payload: VisitPayload): Promise<void> {
  await visitorsApi.post('/post', payload);
}

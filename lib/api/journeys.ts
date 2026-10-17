import { apiClient, type ApiEnvelope, type ApiPage } from './client';

export type JourneyType = 'experience' | 'education';

export type ApiJourney = {
  id: string;
  type: JourneyType;
  role: string;
  companyName: string;
  /** "YYYY-MM" */
  durationFrom: string;
  /** "YYYY-MM", empty while `current` is true. */
  durationTo: string | null;
  current: boolean;
  location?: string;
  mode?: string;
  description: string[];
  skills: string[];
};

export async function getJourneys(type?: JourneyType): Promise<ApiJourney[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiPage<ApiJourney>>>('/journeys', { params: type ? { type } : undefined });
  return data.data.items;
}

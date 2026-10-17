import { apiClient, type ApiEnvelope } from './client';

export type ApiClient = {
  id: string;
  name: string;
  /** Full URL. */
  logoUrl: string | null;
  industry: string;
  websiteUrl: string;
  description: string;
  images: string[];
  displayOrder: number;
};

/** Clients marked "Show on website", in display order (lower first). */
export async function getClients(): Promise<ApiClient[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiClient[]>>('/public/clients');
  return [...data.data].sort((a, b) => a.displayOrder - b.displayOrder);
}

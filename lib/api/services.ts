import { apiClient, type ApiEnvelope, type ApiPage } from './client';

export type ApiServiceRate = {
  amount: number;
  currency: string;
};

export type ApiServiceSubCategory = {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  displayOrder: number;
  rate?: ApiServiceRate | null;
};

export type ApiService = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  subCategories: ApiServiceSubCategory[];
};

/** Services in display order. Pass a two-letter country code to get prices in that country's currency. */
export async function getServices(countryIso2?: string): Promise<ApiService[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiPage<ApiService>>>('/services', { params: countryIso2 ? { countryIso2 } : undefined });
  return [...data.data.items]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((service) => ({
      ...service,
      subCategories: [...(service.subCategories ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
    }));
}

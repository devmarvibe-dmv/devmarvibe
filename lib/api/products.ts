import { apiClient, type ApiEnvelope, type ApiPage } from './client';

export type ApiProduct = {
  id: string;
  productName: string;
  tagline: string;
  description: string;
  productUrl: string;
  createdAt?: string;
};

/** Portfolio products (not the online store), newest first. */
export async function getProducts(): Promise<ApiProduct[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiPage<ApiProduct>>>('/products');
  return data.data.items;
}

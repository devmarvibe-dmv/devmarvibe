import { apiClient } from './client';

export type ApiProduct = {
  id: string;
  productName: string;
  tagline: string;
  description: string;
  productUrl: string;
};

type ProductsResponse = {
  data: { items: ApiProduct[] };
};

export async function getProducts(): Promise<ApiProduct[]> {
  const { data } = await apiClient.get<ProductsResponse>('/products');
  return data.data.items;
}

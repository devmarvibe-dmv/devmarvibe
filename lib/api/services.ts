import { apiClient } from './client';

export type ApiService = {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
};

type ServicesResponse = {
  data: { items: ApiService[] };
};

export async function getServices(): Promise<ApiService[]> {
  const { data } = await apiClient.get<ServicesResponse>('/services');
  return [...data.data.items].sort((a, b) => a.displayOrder - b.displayOrder);
}

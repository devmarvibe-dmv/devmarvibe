import { apiClient, type ApiEnvelope } from './client';

export type MasterSubOption = {
  key: string;
  value: string;
};

export type MasterOption = {
  id: string | number;
  category: string;
  key: string;
  label: string;
  value: string;
  subOptions: MasterSubOption[];
  sortOrder: number;
  isActive: boolean;
};

// The API documentation shows `data.items`, but the live API returns `data.options`; accept both.
type MasterOptionsData = { options?: MasterOption[]; items?: MasterOption[] };

/** Active dropdown values for a category, keyed by option key — e.g. `authorType` → [{ key: 'client', value: 'Client' }]. */
export async function getMasterOptions(category: string): Promise<Record<string, MasterSubOption[]>> {
  const { data } = await apiClient.get<ApiEnvelope<MasterOptionsData>>('/master-options', { params: { category, isActive: true } });
  const options = data.data.options ?? data.data.items ?? [];
  return Object.fromEntries(
    [...options]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((option) => [option.key, option.subOptions ?? []])
  );
}

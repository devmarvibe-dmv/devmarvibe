import { apiClient, type ApiEnvelope } from './client';

export type Country = {
  country: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  phoneNumberFormat?: string | null;
  flag: string;
  currency: string;
  currencyName?: string;
  taxRatePercent?: number;
  inrConversionRate?: number;
};

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<ApiEnvelope<Country[]>>('/public/countries');
  return data.data.filter((country): country is Country => !!country.phonecode);
}

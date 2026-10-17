import { apiClient } from './client';

export type Country = {
  country: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  phoneNumberFormat: string | null;
  flag: string;
  currency: string;
};

type CountriesResponse = {
  data: Country[];
};

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<CountriesResponse>('/public/countries');
  return data.data.filter((country): country is Country => !!country.phonecode);
}

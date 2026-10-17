import { apiClient } from './client';

export type ContactPayload = {
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  services?: string;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
};

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  await apiClient.post('/contact', payload);
}

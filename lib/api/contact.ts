import { apiClient, type ApiEnvelope } from './client';

/** Send email, mobile or both — the console rejects a request with neither. */
export type ContactPayload = {
  name: string;
  email?: string;
  mobile?: string;
  company?: string;
  services?: string;
  description?: string;
  customFieldValues?: Record<string, string>;
  city?: string;
  state?: string;
  country?: string;
  timeZone?: string;
};

export type ContactRequest = {
  id: string;
  trackId: string;
  name: string;
  status: string;
};

export async function submitContactForm(payload: ContactPayload): Promise<ContactRequest> {
  const { data } = await apiClient.post<ApiEnvelope<ContactRequest>>('/contact', payload);
  return data.data;
}

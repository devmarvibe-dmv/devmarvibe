import { apiClient, type ApiEnvelope } from './client';

export type ApiTestimonial = {
  id: string;
  testimonialType: string;
  authorName: string;
  authorTitle?: string | null;
  authorCompany?: string | null;
  authorAvatarUrl?: string | null;
  headline?: string | null;
  content: string;
  status?: string;
  displayOrder?: number;
};

/** Approved and featured testimonials only, in the console's display order. */
export async function getPublishedTestimonials(): Promise<ApiTestimonial[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiTestimonial[]>>('/public/testimonials');
  return [...data.data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export type SubmitTestimonialPayload = {
  authorName: string;
  /** A key from the testimonials "authorType" dropdown options, e.g. client. */
  authorType: string;
  /** Up to 500 characters. */
  content: string;
  consentToPublish: true;
  testimonialType?: 'testimonial' | 'recommendation';
  /** Required unless testimonialType is recommendation. */
  subjectType?: string;
  subjectLabel?: string;
  headline?: string;
  authorTitle?: string;
  authorCompany?: string;
  authorEmail?: string;
  authorLinkedInUrl?: string;
  /** The `url` returned by uploadImage. */
  authorAvatarUrl?: string;
  relationshipType?: string;
  relationshipNote?: string;
};

/** Saved for review; it only appears publicly once approved in the console. */
export async function submitTestimonial(payload: SubmitTestimonialPayload): Promise<{ trackId: string }> {
  const { data } = await apiClient.post<ApiEnvelope<{ trackId: string }>>('/public/testimonials', payload);
  return data.data;
}

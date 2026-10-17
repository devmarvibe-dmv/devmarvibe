import { apiClient } from './client';

export type ApiTestimonial = {
  id?: string;
  testimonialType?: string;
  authorName: string;
  authorType?: string;
  subjectType?: string;
  content: string;
  headline?: string;
  authorAvatarUrl?: string;
  authorLinkedInUrl?: string;
};

type TestimonialsResponse = {
  data: ApiTestimonial[];
};

export async function getPublishedTestimonials(): Promise<ApiTestimonial[]> {
  const { data } = await apiClient.get<TestimonialsResponse>('/public/testimonials');
  return data.data;
}

export type SubmitTestimonialPayload = {
  testimonialType: string;
  authorName: string;
  authorType: string;
  subjectType: string;
  content: string;
  headline?: string;
  relationshipType?: string;
  relationshipNote?: string;
  authorAvatarUrl?: string;
  authorLinkedInUrl?: string;
  consentToPublish: boolean;
};

export async function submitTestimonial(payload: SubmitTestimonialPayload): Promise<void> {
  await apiClient.post('/public/testimonials', payload);
}

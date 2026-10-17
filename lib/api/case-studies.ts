import { apiClient, type ApiEnvelope } from './client';

export type ApiCaseStudy = {
  id: string;
  title: string;
  clientName: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  coverImageUrl: string | null;
  images: string[];
  tags: string[];
  caseStudyUrl: string;
  displayOrder: number;
};

/** Published case studies only, in display order. */
export async function getCaseStudies(): Promise<ApiCaseStudy[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiCaseStudy[]>>('/public/case-studies');
  return [...data.data].sort((a, b) => a.displayOrder - b.displayOrder);
}

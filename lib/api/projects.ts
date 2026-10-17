import { apiClient, type ApiEnvelope, type ApiPage } from './client';

export type ApiProject = {
  id: string;
  projectName: string;
  tagline: string;
  description: string;
  skills: string[];
  associatedWith?: string;
  organizationName?: string;
  projectUrl?: string;
  createdAt?: string;
};

/** Projects, newest first. */
export async function getProjects(): Promise<ApiProject[]> {
  const { data } = await apiClient.get<ApiEnvelope<ApiPage<ApiProject>>>('/projects');
  return data.data.items;
}

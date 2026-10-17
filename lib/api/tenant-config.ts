import { apiClient } from './client';

export type TenantSocialLink = {
  platform: string;
  url: string;
};

export type TenantConfig = {
  settings: {
    supportEmail: string | null;
    name: string;
    socialLinks: TenantSocialLink[];
    contactFormFields: string[];
  };
  applicationConfig: {
    maintenanceMode: boolean;
  };
};

type TenantConfigResponse = {
  data: TenantConfig;
};

export async function getTenantConfig(): Promise<TenantConfig> {
  const { data } = await apiClient.get<TenantConfigResponse>('/tenants/DMV/config');
  return data.data;
}

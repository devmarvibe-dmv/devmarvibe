import { ACCODE, apiClient, type ApiEnvelope } from './client';

export type TenantSocialLink = {
  platform: string;
  url: string;
};

/** Module switches set for the account in the console. Missing keys mean the module is off. */
export type TenantFeatures = Partial<Record<
  | 'products'
  | 'projects'
  | 'services'
  | 'clients'
  | 'caseStudies'
  | 'pageBanners'
  | 'experience'
  | 'testimonials'
  | 'contact'
  | 'analytics'
  | 'vulnerabilityReports'
  | 'blog',
  boolean
>>;

export type TenantConfig = {
  accode: string;
  settings: {
    name: string;
    logo: string | null;
    supportEmail: string | null;
    timezone?: string;
    socialLinks: TenantSocialLink[];
    contactFormFields: string[];
  };
  applicationConfig?: {
    maintenanceMode?: boolean;
  };
  flags?: {
    tenantType?: string;
    companyType?: string;
    status?: string;
    features?: TenantFeatures;
  };
};

export async function getTenantConfig(): Promise<TenantConfig> {
  const { data } = await apiClient.get<ApiEnvelope<TenantConfig>>(`/tenants/${ACCODE}/config`);
  return data.data;
}

/** True unless the console has explicitly switched the module off — so content still shows before the config loads. */
export function isFeatureOn(config: TenantConfig | null, feature: keyof TenantFeatures): boolean {
  return config?.flags?.features?.[feature] !== false;
}

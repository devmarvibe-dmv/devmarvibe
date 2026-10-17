import { apiClient, type ApiEnvelope } from './client';

export type ApiBannerSlide = {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title?: string;
  subtitle?: string;
  linkUrl?: string;
};

type PageBanners = {
  page: string;
  pageKey: string;
  slides: ApiBannerSlide[];
};

/** Active slides for one page, in order — an empty list means the page has no carousel. */
export async function getPageBanners(page: string): Promise<ApiBannerSlide[]> {
  const { data } = await apiClient.get<ApiEnvelope<PageBanners>>('/public/page-banners', { params: { page } });
  return data.data.slides ?? [];
}

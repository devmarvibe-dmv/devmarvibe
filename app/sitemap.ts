import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/testimonials/request`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/security`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IS_PRODUCTION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

const title = 'DevMarvibe | Digital products, engineered for growth';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ['web development', 'mobile app development', 'branding and design', 'digital marketing', 'SEO agency', 'DevMarvibe'],
  authors: [{ name: SITE_NAME }],
  robots: { index: IS_PRODUCTION, follow: IS_PRODUCTION },
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/icon1.png',
    shortcut: '/icon1.png',
    apple: '/icon1.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title,
    description: SITE_DESCRIPTION,
    locale: 'en_IN',
    images: [{ url: '/Main_Logo.png', width: 1000, height: 500, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: SITE_DESCRIPTION,
    images: ['/Main_Logo.png'],
  },
  themeColor: '#14b8a6',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon1.png`,
  description: SITE_DESCRIPTION,
  email: 'hello@devmarvibe.com',
  telephone: '+91-99599-25779',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className={inter.className}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /></body></html>;
}

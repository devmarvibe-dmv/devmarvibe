// Web & mobile packages — the single source for /packages, the comparison table and
// the package picker on /contact. Set `price` here once pricing is decided.

export type PackageId = 'starter' | 'growth' | 'enterprise';
export type Platform = 'web' | 'app';

export type ServicePackage = {
  id: PackageId;
  name: string;
  /** Short label for selects and summaries. */
  shortName: string;
  tagline: string;
  badge?: string;
  suits: string;
  /** What the client brings (Starter only). */
  clientProvides?: string[];
  includes: string[];
  /** Shown as "Charged separately". */
  notIncluded?: string[];
  note?: { title: string; text: string };
  price: string;
  /** Mobile-app version of the same package. */
  appScope: string;
};

export const PACKAGES: ServicePackage[] = [
  {
    id: 'starter',
    name: 'Starter — Launchpad',
    shortName: 'Starter (Launchpad)',
    tagline: 'You bring the content, we build an interactive website on console.devmarvibe.com.',
    suits: 'Small businesses, professionals, shops and startups with their own text, logo and images.',
    clientProvides: [
      'All page text, product or service details and contact information',
      'Logo, brand colours, photos and videos',
      'Reference sites or layout preferences',
      'Domain name (or we register one at cost)',
    ],
    includes: [
      'Fully responsive, interactive website for desktop, tablet and mobile',
      'Up to the agreed number of pages, e.g. Home, About, Services, Gallery, Contact',
      'Contact and enquiry forms, WhatsApp and call buttons, Google Maps',
      'Basic on-page SEO: titles, meta descriptions and sitemap',
      'Hosting and management through console.devmarvibe.com',
      'SSL certificate and launch support',
    ],
    notIncluded: [
      'Content writer, if you need copy written or rewritten',
      'Designer, if you need a logo, branding or custom graphics',
    ],
    price: 'Price on request',
    appScope: 'Your content turned into an interactive app, managed through console.devmarvibe.com. Designer and content writer charged separately.',
  },
  {
    id: 'growth',
    name: 'Growth Studio',
    shortName: 'Growth Studio',
    tagline: 'Done for you: our designer, content writer and research handle everything, running on our console.',
    badge: 'Done for you',
    suits: 'Businesses that want a professional online presence without preparing any material themselves.',
    includes: [
      'Everything in Starter',
      'Dedicated designer: custom UI/UX, layout, graphics and brand-aligned visuals',
      'Content writer: all page copy written for your audience and for SEO',
      'Complete research: market, competitor and keyword research, shared as a report',
      'Sitemap and user-journey planning before design starts',
      'Stock images and icon sourcing',
      'Integrations such as payment gateway, SMS/email notifications, maps and analytics',
      'Hosting and management through console.devmarvibe.com',
    ],
    note: {
      title: 'Console and API charges',
      text: 'Integrations that run on APIs supplied through console.devmarvibe.com — payments, SMS, email, maps or AI features — are billed separately on actual usage.',
    },
    price: 'Price on request',
    appScope: 'Designer, content writer and full research provided; the app runs on console.devmarvibe.com, with API usage billed where APIs come from the console.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Suite',
    shortName: 'Enterprise Suite',
    tagline: 'A fully custom web application with your own admin panel and database, built around your processes.',
    suits: 'Businesses that need portals, booking or ordering systems, CRMs, e-commerce, dashboards or SaaS products.',
    includes: [
      'Requirement analysis, workflow mapping and technical specification',
      'Custom UI/UX design for every user role',
      'Custom admin panel to manage users, content, orders, reports and settings',
      'Dedicated database designed for your data, with regular backups',
      'User login, roles and permissions',
      'Custom features and third-party integrations: payments, SMS, email, ERP, CRM',
      'Reports and analytics dashboard',
      'Security hardening, testing and performance optimisation',
      'Deployment on your own server or cloud account, or on ours',
      'Source code and documentation handover, as agreed',
      'Post-launch support period and optional annual maintenance',
    ],
    note: {
      title: 'Optional add-ons',
      text: 'The designer, content writer and research from Growth Studio can be added to Enterprise Suite.',
    },
    price: 'Quoted per project',
    appScope: 'A custom app with its own admin panel and database, user roles, push notifications and integrations.',
  },
];

export const PACKAGE_IDS = PACKAGES.map((item) => item.id);

export function getPackage(id: string | null | undefined): ServicePackage | undefined {
  return PACKAGES.find((item) => item.id === id);
}

/** `true` = included, `false` = not included, string = included with a qualifier. */
export type ComparisonValue = boolean | string;

export const COMPARISON: { feature: string; values: Record<PackageId, ComparisonValue> }[] = [
  { feature: 'Content supplied by', values: { starter: 'You', growth: 'Our content writer', enterprise: 'You, or our writer as an add-on' } },
  { feature: 'Designer', values: { starter: 'Extra charge', growth: true, enterprise: 'Included (UI/UX)' } },
  { feature: 'Content writer', values: { starter: 'Extra charge', growth: true, enterprise: 'Add-on' } },
  { feature: 'Research', values: { starter: false, growth: 'Full research report', enterprise: 'Requirement analysis' } },
  { feature: 'Interactive responsive site', values: { starter: true, growth: true, enterprise: true } },
  { feature: 'Managed through', values: { starter: 'console.devmarvibe.com', growth: 'console.devmarvibe.com', enterprise: 'Your own admin panel' } },
  { feature: 'API usage charges', values: { starter: 'Not applicable', growth: 'Billed per usage', enterprise: 'Billed per usage' } },
  { feature: 'Custom admin panel', values: { starter: false, growth: false, enterprise: true } },
  { feature: 'Dedicated database', values: { starter: false, growth: false, enterprise: true } },
  { feature: 'User login and roles', values: { starter: false, growth: 'Optional', enterprise: true } },
  { feature: 'Mobile app version', values: { starter: true, growth: true, enterprise: true } },
  { feature: 'Price', values: { starter: 'On request', growth: 'On request', enterprise: 'Quoted per project' } },
];

export const APP_COMMON = [
  'Publishing on the Google Play Store and Apple App Store (developer account fees paid by you)',
  'Push notifications setup',
  'App store listing: screenshots, description and icon — copy and graphics included in Growth Studio and Enterprise Suite',
  'Web + app combo pricing when you take both together',
];

export const ADD_ONS = [
  'Content writer, per page or per project',
  'Designer: logo, branding, banners and social media creatives',
  'Extra pages or features beyond the agreed scope',
  'Annual maintenance and support plan',
  'Domain, premium hosting and business email',
];

export const TERMS = [
  '50% advance to start, balance before launch',
  'Two rounds of revisions included at each design stage',
  'Delays in your content or approvals extend the timeline',
  'Domain, hosting and console access renew annually',
];

/** Short labels for option cards; PLATFORM_LABELS is what gets sent with the enquiry. */
export const PLATFORM_SHORT_LABELS: Record<Platform | 'both', string> = {
  web: 'Website',
  app: 'Mobile app',
  both: 'Both',
};

export const PLATFORM_LABELS: Record<Platform | 'both', string> = {
  web: 'Website',
  app: 'Mobile app (Android & iOS)',
  both: 'Website + mobile app',
};

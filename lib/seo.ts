export const SITE_URL = 'https://devmarvibe.com';
export const SITE_NAME = 'DevMarvibe';
export const SITE_DESCRIPTION = 'DevMarvibe builds web and mobile apps, digital products, and growth systems for ambitious teams.';

// Only the production deploy should be indexed by search engines.
// Vercel sets VERCEL_ENV automatically: 'production' for the production branch, 'preview'
// for every other branch (e.g. release/UAT) and 'development' locally. Outside Vercel,
// fall back to NODE_ENV so a local `next start` behaves like production.
export const IS_PRODUCTION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production';

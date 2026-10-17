export const SITE_URL = 'https://devmarvibe.com';
export const SITE_NAME = 'DevMarvibe';
export const SITE_DESCRIPTION = 'DevMarvibe builds web and mobile apps, digital products, and growth systems for ambitious teams.';

// Only the production deploy should be indexed by search engines.
// Vercel sets VERCEL_ENV to 'production', 'preview' or 'development'; Netlify sets CONTEXT to
// 'production', 'deploy-preview' or 'branch-deploy' (e.g. release/UAT). Both are set automatically.
export const IS_PRODUCTION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.CONTEXT
    ? process.env.CONTEXT === 'production'
    : process.env.NODE_ENV === 'production';

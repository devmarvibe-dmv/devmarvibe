const { version } = require('./package.json');

// Console-hosted images (logos, avatars, banners) go through next/image; keep in step with lib/api/client.ts.
const backendHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || 'https://console.devmarvibe.com').hostname;
  } catch {
    return 'console.devmarvibe.com';
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Never ship browser source maps to production.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: backendHost, pathname: '/api/files/**' }],
  },
  env: {
    // Shown in the site footer next to the DMV Console version.
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BACKEND_HOST: backendHost,
  },
};

module.exports = nextConfig;

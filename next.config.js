const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    // Shown in the site footer next to the DMV Console version.
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

module.exports = nextConfig;

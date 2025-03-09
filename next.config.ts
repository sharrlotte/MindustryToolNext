import { NextConfig } from 'next';

import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
    reactCompiler: true,
    staleTimes: {
      static: 600,
    },
    optimizePackageImports: ['lucide-react'],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  productionBrowserSourceMaps: true,
  crossOrigin: 'anonymous',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mindustry-tool.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.mindustry-tool.com',
        pathname: '/**',
      },
      {
        hostname: 'blob:mindustry-tool.com',
        pathname: '/**',
      },
      {
        hostname: 'blob:localhost',
        pathname: '/**',
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  
});

const analyze = process.env.ANALYZE === 'true';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: analyze,
});

module.exports = withMDX(withBundleAnalyzer(nextConfig));

import { NextConfig } from 'next';
import rehypeHighlight from 'rehype-highlight';
import frontmatter from 'remark-frontmatter';

import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    scrollRestoration: true,
  },
  pageExtensions: ['ts', 'tsx'],
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
  options: {
    remarkPlugins: [[frontmatter, { type: 'yaml', marker: '-' }]],
    rehypePlugins: [rehypeHighlight],
  },
});

const analyze = process.env.ANALYZE === 'true';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: analyze,
});

module.exports = withSentryConfig(withMDX(withBundleAnalyzer(nextConfig)), {
  org: 'mindustrytool',
  project: 'mindustry-tool',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: false,
  telemetry: false,
});

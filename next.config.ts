import { NextConfig } from 'next';
import rehypeHighlight from 'rehype-highlight';
import frontmatter from 'remark-frontmatter';



import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';


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
  options: {
    remarkPlugins: [[frontmatter, { type: 'ymal', marker: '-' }]],
    rehypePlugins: [rehypeHighlight],
  },
});

const analyze = process.env.ANALYZE === 'true';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
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

  automaticVercelMonitors: true,
});

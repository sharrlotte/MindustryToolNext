import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  compiler: {
    styledComponents: true,
  },
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

const analyze = process.env.ANALYZE === 'true';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: analyze,
});

module.exports = withBundleAnalyzer(nextConfig);

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
    staleTimes: {
      dynamic: 10,
    },
  },
  crossOrigin: 'anonymous',
  reactStrictMode: true,
  webpack: (config: any) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
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
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mindustry-tool.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com/diuvht7dq/image/upload/v1683651720',
        port: '',
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

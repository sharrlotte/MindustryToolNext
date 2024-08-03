/* @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
const nextConfig = {
  experimental: {
    ppr: true,
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
        hostname: 'res.cloudinary.com/dyx7yui8u/image/upload/v1703328847',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const analyze = process.env.ANALYZE === 'true';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: analyze,
});

module.exports = withBundleAnalyzer(nextConfig);

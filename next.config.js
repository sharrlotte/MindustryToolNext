/* @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   scrollRestoration: true,
  // },
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
        protocol: 'http',
        hostname: 'res.cloudinary.com/dyx7yui8u/image/upload/v1703328847',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

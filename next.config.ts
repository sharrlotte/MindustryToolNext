import { NextConfig } from 'next';



import bundleAnalyzer from '@next/bundle-analyzer';

const now = new Date();
const buildVersion = `v${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

const nextConfig: NextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	env: { NEXT_PUBLIC_BUILD_VERSION: buildVersion },
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
			{
				source: '/sw.js',
				headers: [
					{
						key: 'Content-Type',
						value: 'application/javascript; charset=utf-8',
					},
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; script-src 'self'",
					},
				],
			},
		];
	},
	experimental: {
		reactCompiler: process.env.NODE_ENV === 'production',
	},
	productionBrowserSourceMaps: true,
	pageExtensions: ['ts', 'tsx'],
	crossOrigin: 'anonymous',
	reactStrictMode: process.env.NODE_ENV === 'development',
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

const withBundleAnalyzer = bundleAnalyzer({
	enabled: analyze,
});

module.exports = withBundleAnalyzer(nextConfig);

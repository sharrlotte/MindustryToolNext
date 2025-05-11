import { NextConfig } from 'next';
import rehypeHighlight from 'rehype-highlight';
import frontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const config: NextConfig =
	process.env.NODE_ENV === 'development'
		? {
				experimental: {
					optimizePackageImports: ['lucide-react', 'usehooks-ts', 'three', 'framer-motion', 'axios'],
				},
			}
		: {
				logging: {
					fetches: {
						fullUrl: true,
					},
				},
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
			};

const nextConfig: NextConfig = {
	...config,
	experimental: {
		reactCompiler: true,
	},
	pageExtensions: ['tsx'],
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

const withMDX =
	process.env.NODE_ENV === 'development'
		? (config: NextConfig) => config
		: createMDX({
				options: {
					remarkPlugins: [[frontmatter, { type: 'yaml', marker: '-' }], [remarkGfm]],
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
	sourcemaps: {
		disable: !process.env.SENTRY,
	},
	tunnelRoute: '/monitoring',
	disableLogger: true,
	automaticVercelMonitors: false,
	telemetry: false,
});

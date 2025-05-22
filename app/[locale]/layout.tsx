import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Arimo } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import env from '@/constant/env';
import { SessionProvider } from '@/context/session.context';
import { SocketProvider } from '@/context/socket.context';
import { Locale, locales } from '@/i18n/config';
import { cn, generateAlternate } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import { GoogleAnalytics } from '@next/third-parties/google';

import './../globals.css';

const ClientInit = dynamic(() => import('@/app/[locale]/client-init'));

const noto = Arimo({
	variable: '--font-noto',
	subsets: ['vietnamese', 'cyrillic'],
	display: 'swap',
});

const icon = localFont({
	src: [
		{
			path: '../../public/fonts/icon.ttf',
		},
	],
	variable: '--font-icon',
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(env.url.base),
	title: 'MindustryTool',
	description: 'A website about mindustry, providing schematics, maps, server hosting, wiki, tutorials and more',
	generator: 'Next.js',
	applicationName: 'MindustryTool',
	keywords: ['Mindustry', 'Schematic', 'Map', 'Mod', 'Post'],
	twitter: {
		site: '@MindustryTool',
		card: 'summary_large_image',
	},
	openGraph: {
		images: 'https://mindustrygame.github.io/1.d25af17a.webp',
		title: 'Mindustry',
		description: 'MindustryTool',
		siteName: 'MindustryTool',
	},
	alternates: generateAlternate('/'),
	robots: {
		index: true,
		follow: true,
		nocache: true,
	},
};

type RootProps = {
	children: React.ReactNode;
	params: Promise<{
		locale: Locale;
	}>;
};

export async function generateStaticParams() {
	return process.env.SENTRY ? locales.map((locale) => ({ locale })) : [{ locale: 'en' }];
}

export default async function Root({ children, params }: RootProps) {
	const { locale } = await params;

	if (process.env.NODE_ENV === 'production') {
		ReactDOM.preconnect('https://image.mindustry-tool.com');
		ReactDOM.preconnect('https://api.mindustry-tool.com');
		ReactDOM.preconnect('https://fonts.googleapis.com');
		ReactDOM.preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
	}

	return (
		<html
			className={cn(
				'dark h-full w-full overflow-hidden bg-background text-foreground antialiased',
				noto.className,
				icon.className,
				noto.variable,
				icon.variable,
				'font-noto',
			)}
			lang={locale}
			data-color-mode="dark"
			suppressHydrationWarning
		>
			<body className="overflow-hidden w-full h-full">
				<QueryProvider>
					<ThemeProvider>
						<SessionProvider locale={locale}>
							<SocketProvider>
								<GoogleAnalytics gaId="G-CGKXS6096G" />
								<Toaster />
								<ClientInit />
								{children}
							</SocketProvider>
						</SessionProvider>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}

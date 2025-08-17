import type { Metadata } from 'next';
import { Arimo } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';
import ReactDOM from 'react-dom';

import ClientInit from '@/app/[locale]/client-init';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import env from '@/constant/env';
import { SessionProvider } from '@/context/session.context';
import { SocketProvider } from '@/context/socket.context';
import { Locale, locales } from '@/i18n/config';
import { generateAlternate } from '@/lib/i18n.utils';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import { GoogleAnalytics } from '@next/third-parties/google';

import './../globals.css';

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
		images: '/home.jpg',
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
				'h-full w-full overflow-hidden bg-background text-foreground antialiased',
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
				<SessionProvider>
					<QueryProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
							<SocketProvider>
								{process.env.NODE_ENV === 'production' && <GoogleAnalytics gaId="G-CGKXS6096G" />}
								<Toaster />
								<ClientInit />
								{children}
							</SocketProvider>
						</ThemeProvider>
					</QueryProvider>
				</SessionProvider>
			</body>
		</html>
	);
}

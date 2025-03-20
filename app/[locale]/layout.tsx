import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Arimo, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import env from '@/constant/env';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import './../globals.css';

const ClientInit = dynamic(() => import('@/app/[locale]/client-init'));

const inter = Arimo({
  variable: '--font-inter',
  subsets: ['vietnamese'],
  weight: '500',
  display: 'swap',
});

const noto = Noto_Sans_KR({
  variable: '--font-noto',
  subsets: ['cyrillic'],
  weight: '700',
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

const hrefLangs: Record<Locale, string> = {
  en: 'en',
  kr: 'ko',
  cn: 'zh',
  jp: 'ja',
  ru: 'ru',
  uk: 'uk',
  vi: 'vi',
};

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
  },
  alternates: {
    canonical: './',
    languages: Object.fromEntries(env.locales.map((lang) => [hrefLangs[lang], `${env.url.base}/${lang}`])),
  },
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
  return locales.map((locale) => ({ locale }));
}

export default async function Root({ children, params }: RootProps) {
  const { locale } = await params;

  ReactDOM.preconnect('https://image.mindustry-tool.com');
  ReactDOM.preconnect('https://api.mindustry-tool.com');
  ReactDOM.preconnect('https://fonts.googleapis.com');
  ReactDOM.preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });

  return (
    <html
      className={cn('dark h-full w-full overflow-hidden bg-background text-foreground antialiased', noto.variable, inter.variable, icon.variable, locale === 'kr' ? 'font-noto' : 'font-inter')}
      lang={locale}
      data-color-mode="dark"
      suppressHydrationWarning
    >
      <body className="h-full w-full overflow-hidden">
        <QueryProvider>
          <ClientInit />
          <ThemeProvider>
            <SessionProvider>
              <SocketProvider>
                <Toaster />
                {children}
              </SocketProvider>
            </SessionProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

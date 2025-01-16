import { dir } from 'i18next';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';
import ReactDOM from 'react-dom';

import ClientInit from '@/app/[locale]/client-init';
import NavigationBar from '@/app/[locale]/navigation';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import env from '@/constant/env';
import I18nProvider from '@/context/locale-context';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { TagsProvider } from '@/context/tags-context';
import { CookiesProvider } from '@/hooks/use-cookies';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './../globals.css';

const inter = Inter({
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

export const metadata: Metadata = {
  metadataBase: new URL(env.url.base),
  title: 'MindustryTool',
  description: 'A website about mindustry',
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
    languages: Object.fromEntries(env.locales.map((lang) => [lang, `${env.url.base}/${lang}`])),
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
      dir={dir(locale)}
      data-color-mode="dark"
      suppressHydrationWarning
    >
      <body className="h-full w-full overflow-hidden">
        {process.env.NODE_ENV === 'production' ? (
          <>
            <Analytics />
            <SpeedInsights />
            <GoogleAnalytics gaId="G-1R9S5SV72C" />
          </>
        ) : (
          // <Script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
          <div></div>
        )}
        <CookiesProvider>
          <I18nProvider locale={locale}>
            <QueryProvider>
              <ThemeProvider>
                <TagsProvider locale={locale}>
                  <SessionProvider>
                    <SocketProvider>
                      <Toaster />
                      <NavigationBar>
                        <ClientInit />
                        {children}
                      </NavigationBar>
                    </SocketProvider>
                  </SessionProvider>
                </TagsProvider>
              </ThemeProvider>
            </QueryProvider>
          </I18nProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}

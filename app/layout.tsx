import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import React from 'react';
import ReactDOM from 'react-dom';

import env from '@/constant/env';
import I18nProvider from '@/context/locale-context';
import { Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

import './globals.css';

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
      path: '../public/fonts/icon.ttf',
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

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function Root({ children, params }: Props) {
  const { locale } = await params;

  ReactDOM.preconnect('https://image.mindustry-tool.app');
  ReactDOM.preconnect('https://api.mindustry-tool.app');
  ReactDOM.preconnect('https://fonts.googleapis.com');
  ReactDOM.preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });

  const cookie = await cookies();
  const cookieLocale = cookie.get('Locale')?.value ?? 'en';

  return (
    <html
      className={cn('dark h-full w-full overflow-hidden bg-background text-foreground antialiased', noto.variable, inter.variable, icon.variable)}
      lang={locale ?? cookieLocale}
      data-color-mode="dark"
      suppressHydrationWarning
    >
      <body className="h-full w-full overflow-hidden">
        <I18nProvider locale={locale ?? cookieLocale}>{children}</I18nProvider>
      </body>
    </html>
  );
}

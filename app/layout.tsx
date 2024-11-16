import env from '@/constant/env';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import React from 'react';

import './globals.css';
import Head from 'next/head';

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
    locale: string;
  }>;
};

export default async function Root({ children, params }: Props) {
  const { locale } = await params;

  return (
    <html
      className={cn('dark h-full w-full overflow-hidden bg-background text-foreground antialiased', noto.variable, inter.variable, icon.variable)}
      lang={locale ?? 'en'}
      data-color-mode="dark"
      suppressHydrationWarning
    >
      <Head>
        <link rel="preconnect" href="https://image.mindustry-tool.app" />
        <link rel="preconnect" href="https://api.mindustry-tool.app" />
      </Head>
      <body className="h-full w-full overflow-hidden">{children}</body>
    </html>
  );
}

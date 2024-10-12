import { ThemeProvider } from '@/components/theme/theme-provider';
import env from '@/constant/env';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import './globals.css';

const ClientInit = dynamic(() => import('@/app/[locale]/client-init'));

const inter = Inter({
  variable: '--font-inter',
  subsets: ['vietnamese'],
});

const noto = Noto_Sans_KR({
  variable: '--font-noto',
  subsets: ['cyrillic'],
  weight: '700',
});

const icon = localFont({
  src: [
    {
      path: '../public/fonts/icon.ttf',
    },
  ],
  variable: '--font-icon',
  display: 'fallback',
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
    languages: Object.fromEntries(
      env.locales.map((lang) => [lang, `${env.url.base}/${lang}`]),
    ),
  },
  robots: {
    index: false,
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
      className={cn(
        'dark h-full w-full overflow-hidden bg-background text-foreground antialiased',
        noto.variable,
        inter.variable,
        icon.variable,
      )}
      lang={locale ?? 'en'}
      suppressHydrationWarning
      data-color-mode="dark"
    >
      <body className="h-full w-full overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader height={2} showSpinner={false} color="white" />
          <SessionProvider>
            <SocketProvider>
              <QueryProvider>
                <ClientInit />
                {children}
              </QueryProvider>
            </SocketProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

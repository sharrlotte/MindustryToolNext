import { ThemeProvider } from '@/components/theme/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
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

const ClientInit = dynamic(() => import('@/app/[locale]/client-init'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.url.base),
  title: 'MindustryTool',
  description: 'A website about mindustry',
};

// const font = localFont({
//   src: [
//     {
//       path: '../public/fonts/font.woff',
//       weight: '500',
//     },
//   ],
//   variable: '--font-mindustry',
// });

const inter = Inter({
  variable: '--font-inter',
  subsets: ['vietnamese'],
});

const noto = Noto_Sans_KR({
  variable: '--font-noto',
  subsets: ['cyrillic'],
  weight: '900',
});

const icon = localFont({
  src: [
    {
      path: '../public/fonts/icon.ttf',
    },
  ],
  variable: '--font-icon',
});

type RootParam = {
  locale: string;
};

type Props = {
  children: React.ReactNode;
  params: RootParam;
};

export async function generateStaticParams() {
  return [
    {
      locale: 'vi',
    },
    {
      locale: 'en',
    },
  ];
}

export default async function Root({ children, params }: Props) {
  return (
    <html
      className={cn(
        'dark h-full w-full overflow-hidden bg-background text-foreground antialiased',
        // font.variable,
        params.locale === 'kr' ? noto.variable : inter.variable,
        icon.variable,
      )}
      lang={params.locale ?? 'en'}
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
                <TooltipProvider>
                  <ClientInit />
                  {children}
                </TooltipProvider>
              </QueryProvider>
            </SocketProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

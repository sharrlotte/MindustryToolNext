import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';
import Script from 'next/script'

import ClientInit from '@/app/[locale]/client-init';
import { ThemeProvider } from '@/components/theme/theme-provider';
import env from '@/constant/env';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import './globals.css';

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

export default async function Root({ children, params }: Props) {
  return (
    <html
      className={cn(
        'dark h-full w-full overflow-hidden bg-background text-foreground antialiased',
        // font.variable,
        inter.variable,
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
                <ClientInit />
                {children}
              </QueryProvider>
            </SocketProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1288517130363555"
     crossorigin="anonymous"></Script>
    </html>
  );
}

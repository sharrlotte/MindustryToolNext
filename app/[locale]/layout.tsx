import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';

import ClientInit from '@/app/[locale]/client-init';
import { Toaster } from '@/components/ui/toaster';
import env from '@/constant/env';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { cn } from '@/lib/utils';
import { I18nProviderClient } from '@/locales/client';

import { ThemeProvider } from '../../components/theme/theme-provider';
import QueryProvider from '../../query/config/query-provider';
import './../globals.css';
import NavigationBar from './navigation';

export const metadata: Metadata = {
  metadataBase: new URL(env.url.base),
  title: 'MindustryTool',
  description: 'A website about mindustry',
};

type RootParam = {
  locale: string;
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
      path: '../../public/fonts/icon.ttf',
    },
  ],
  variable: '--font-icon',
});

type RootProps = {
  children: React.ReactNode;
  params: RootParam;
};

export default function Root({ children, params }: RootProps) {
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
      <body className={cn('h-full w-full overflow-hidden')}>
        <I18nProviderClient locale={params.locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader height={2} showSpinner={false} color="white" />
            <Toaster />
            <SessionProvider>
              <SocketProvider>
                <QueryProvider>
                  <ClientInit />
                  <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
                    <NavigationBar />
                    <div className="relative h-full w-full overflow-hidden">
                      {children}
                    </div>
                  </div>
                </QueryProvider>
              </SocketProvider>
            </SessionProvider>
          </ThemeProvider>
        </I18nProviderClient>
      </body>
    </html>
  );
}

import './../globals.css';

import ClientInit from '@/app/[locale]/client-init';
import { I18nProviderClient } from '@/locales/client';
import type { Metadata } from 'next';
import NavigationBar from './navigation';
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from '../../query/config/query-provider';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../../components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import env from '@/constant/env';
import localFont from 'next/font/local';
import { SocketContext, SocketProvider } from '@/context/socket-context';

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
        'dark h-full w-full select-none overflow-hidden bg-background text-foreground antialiased',
        // font.variable,
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
            <SessionProvider
              refetchOnWindowFocus={false}
              refetchInterval={2 * 60}
            >
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

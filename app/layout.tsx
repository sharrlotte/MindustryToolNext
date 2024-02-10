import env from '@/constant/env';
import NavigationBar from './navigation';
import QueryProvider from '../query/config/query-provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '../components/theme/theme-provider';
import { Jura } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

import './globals.css';
import ClientInit from '@/app/client-init';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  metadataBase: new URL(env.url.base),
  title: 'MindustryTool',
  description: 'A website about mindustry',
};

type RootParam = {
  lang: string;
};

export async function generateStaticParams(): Promise<RootParam[]> {
  return env.locales.map((locale) => {
    return {
      lang: locale,
    };
  });
}

type RootProps = {
  children: React.ReactNode;
  params: RootParam;
};

export default function Root({ children, params }: RootProps) {
  return (
    <html
      className="dark h-full w-full select-none overflow-hidden bg-background antialiased"
      lang={params.lang ?? 'en'}
      suppressHydrationWarning
      data-color-mode="dark"
    >
      <body className={cn('h-full w-full overflow-hidden')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader height={2} showSpinner={false} />
          <Toaster />
          <SessionProvider
            refetchOnWindowFocus={false}
            refetchInterval={2 * 60}
          >
            <QueryProvider>
              <ClientInit />
              <div className="grid h-full w-full grid-rows-[2.5rem_1fr] overflow-hidden">
                <NavigationBar />
                <div className="relative h-full w-full overflow-hidden">
                  {children}
                </div>
              </div>
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

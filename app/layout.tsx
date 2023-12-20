import env from '@/constant/env';
import NavigationBar from './navigation';
import QueryProvider from '../query/config/query-provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '../components/theme/theme-provider';
import { Monomaniac_One, Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

import './globals.css';
import ClientInit from '@/app/client-init';
import { Session } from 'next-auth';
import NextSessionProvider from '@/auth/session-provider';

const inter = Monomaniac_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
});

const fallback = Roboto({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  adjustFontFallback: false,
});

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
  session: Session | null;
};

export default function Root({ children, params, session }: RootProps) {
  return (
    <html
      className="dark grid min-h-[calc(100vh-3rem)] select-none overflow-x-hidden bg-background antialiased "
      lang={params.lang ?? 'en'}
      suppressHydrationWarning
    >
      <body className={cn(fallback.className, inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader height={2} showSpinner={false} />
          <Toaster />
          <QueryProvider>
            <NextSessionProvider>
              <ClientInit />
              <NavigationBar />
              <div className="flex h-full w-full flex-col overflow-auto p-4">
                {children}
              </div>
            </NextSessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import dynamic from 'next/dynamic';

import ClientInit from '@/app/[locale]/client-init';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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

const NavigationBar = dynamic(() => import('@/app/[locale]/navigation'));

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

  return (
    <div className={cn('h-full w-full overflow-hidden', locale === 'kr' ? 'font-noto' : 'font-inter')}>
      {process.env.NODE_ENV === 'production' && (
        <>
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics gaId="G-1R9S5SV72C" />
        </>
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
    </div>
  );
}

import ClientInit from '@/app/[locale]/client-init';
import NavigationBar from '@/app/[locale]/navigation';

import { ThemeProvider } from '@/components/theme/theme-provider';
import Toaster from '@/components/ui/toaster';

import I18nProvider from '@/context/locale-context';
import { SessionProvider } from '@/context/session-context';
import { SocketProvider } from '@/context/socket-context';
import { TagsProvider } from '@/context/tags-context';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';
import QueryProvider from '@/query/config/query-provider';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
        </>
      )}
      <I18nProvider locale={locale}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TagsProvider locale={locale}>
            <SessionProvider>
              <SocketProvider>
                <QueryProvider>
                  <ClientInit />
                  <Toaster />
                  <NavigationBar>{children}</NavigationBar>
                </QueryProvider>
              </SocketProvider>
            </SessionProvider>
          </TagsProvider>
        </ThemeProvider>
      </I18nProvider>
    </div>
  );
}

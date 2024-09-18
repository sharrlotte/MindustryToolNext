import I18nProvider from '@/app/[locale]/i18n-provider';
import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Fragment } from 'react';

const NavigationBar = dynamic(() => import('./navigation'), { ssr: false });
const Toaster = dynamic(() => import('@/components/ui/toaster'), {
  ssr: false,
});

type RootProps = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Root({
  children,
  params: { locale },
}: RootProps) {
  return (
    <Fragment>
      <I18nProvider locale={locale} />
      <Toaster />
      <div
        className={cn(
          'font-icon grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden',
          locale === 'kr' ? 'font-noto' : 'font-inter',
        )}
      >
        <NavigationBar />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </Fragment>
  );
}

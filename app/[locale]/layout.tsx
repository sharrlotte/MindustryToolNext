import I18nProvider from '@/app/[locale]/i18n-provider';
import { Locale } from '@/i18n/config';
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
  return [
    {
      locale: 'vi',
    },
    {
      locale: 'en',
    },
  ];
}

export default async function Root({ children, params }: RootProps) {
  return (
    <Fragment>
      <I18nProvider locale={params.locale} />
      <Toaster />
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
        <NavigationBar />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </Fragment>
  );
}

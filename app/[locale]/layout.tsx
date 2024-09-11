import { I18nProviderClient } from '@/locales/client';

import dynamic from 'next/dynamic';

const NavigationBar = dynamic(() => import('./navigation'), { ssr: false });
const Toaster = dynamic(() => import('@/components/ui/toaster'), {
  ssr: false,
});

type RootProps = {
  children: React.ReactNode;
  params: {
    locale: string;
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
    <I18nProviderClient locale={params.locale}>
      <Toaster />
      <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
        <NavigationBar />
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </I18nProviderClient>
  );
}

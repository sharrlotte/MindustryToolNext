import { Toaster } from '@/components/ui/toaster';
import { I18nProviderClient } from '@/locales/client';

import NavigationBar from './navigation';

type RootProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

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

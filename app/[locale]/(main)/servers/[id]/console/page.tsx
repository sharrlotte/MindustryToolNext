import { Metadata } from 'next';

import ConsoleInput from '@/app/[locale]/(main)/servers/[id]/console/console-input';
import ServerConsolePage from '@/app/[locale]/(main)/servers/[id]/console/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('console');

  return {
    title: formatTitle(title),
  };
}

export default async function Page() {
  return (
    <div className="grid h-full w-full grid-rows-[1fr_2.5rem] gap-2 overflow-hidden">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-x-hidden bg-card rounded-lg">
          <ServerConsolePage />
        </div>
      </div>
      <ConsoleInput />
    </div>
  );
}

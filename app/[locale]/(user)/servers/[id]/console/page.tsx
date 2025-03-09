import { Metadata } from 'next';

import ConsoleInput from '@/app/[locale]/(user)/servers/[id]/console/console-input';
import ServerConsolePage from '@/app/[locale]/(user)/servers/[id]/console/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    id: string;
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

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div className="grid h-full w-full grid-rows-[1fr_2.5rem] gap-2 overflow-hidden">
      <div className="grid h-full w-full overflow-hidden">
        <div className="flex h-full flex-col gap-1 overflow-x-hidden bg-background">
          <ServerConsolePage id={id} />
        </div>
      </div>
      <ConsoleInput id={id} />
    </div>
  );
}

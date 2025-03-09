import { Metadata } from 'next';

import AddMapDialog from '@/app/[locale]/(main)/servers/[id]/maps/add-map-dialog';
import ServerMaps from '@/app/[locale]/(main)/servers/[id]/maps/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('map');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-2 overflow-hidden h-full">
      <div className="flex h-14 items-center justify-end bg-card rounded-md p-2">
        <AddMapDialog serverId={id} />
      </div>
      <ServerMaps id={id} />
    </div>
  );
}

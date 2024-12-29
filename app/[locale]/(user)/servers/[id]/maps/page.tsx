import { Metadata } from 'next';

import ServerMaps from '@/app/[locale]/(user)/servers/[id]/maps/page.client';

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
  const title = await t('map');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ServerMaps id={id} />;
}

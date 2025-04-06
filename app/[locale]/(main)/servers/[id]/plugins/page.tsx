import { Metadata } from 'next';

import ServerPluginPage from '@/app/[locale]/(main)/servers/[id]/plugins/page.client';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('plugin');

  return {
    title: formatTitle(title),
    alternates: generateAlternate(`/servers/${id}/plugins`),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ServerPluginPage id={id} />;
}

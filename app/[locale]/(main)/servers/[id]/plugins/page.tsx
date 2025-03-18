import { Metadata } from 'next';

import AddPluginDialog from '@/app/[locale]/(main)/servers/[id]/plugins/add-plugin-dialog';
import ServerPluginPage from '@/app/[locale]/(main)/servers/[id]/plugins/page.client';

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
  const title = t('plugin');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <ServerPluginPage id={id} />;
}

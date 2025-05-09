import { Metadata } from 'next';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

import PageClient from './page.client';

type Props = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('log');

  return {
    title: formatTitle(title),
    alternates: generateAlternate(`/servers/${id}/log`),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PageClient id={id} />;
}

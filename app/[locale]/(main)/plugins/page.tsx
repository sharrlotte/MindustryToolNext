import { Metadata } from 'next';
import React from 'react';

import Client from '@/app/[locale]/(main)/plugins/page.client';


import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';
import { ItemPaginationQueryType } from '@/query/search-query';

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('plugin');

  return {
    title: formatTitle(title),
  };
}

export default async function Page() {
  return <Client />;
}

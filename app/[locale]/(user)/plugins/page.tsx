import { Metadata } from 'next';
import React from 'react';

import { serverApi, translate } from '@/action/action';
import Client from '@/app/[locale]/(user)/plugins/page.client';
import ErrorScreen from '@/components/common/error-screen';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getPlugins } from '@/query/plugin';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'plugin');

  return {
    title: formatTitle(title),
  };
}

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const plugins = await serverApi((axios) => getPlugins(axios, data));

  if (isError(plugins)) {
    return <ErrorScreen error={plugins} />;
  }

  return <Client plugins={plugins} />;
}

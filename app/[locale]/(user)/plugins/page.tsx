import React from 'react';

import { serverApi } from '@/action/action';
import Client from '@/app/[locale]/(user)/plugins/page.client';
import ErrorScreen from '@/components/common/error-screen';
import { isError } from '@/lib/utils';
import { getPlugins } from '@/query/plugin';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
};

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

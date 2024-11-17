import { Metadata } from 'next/dist/types';

import { serverApi } from '@/action/action';
import Client from '@/app/[locale]/(user)/plugins/page.client';
import ErrorScreen from '@/components/common/error-screen';
import env from '@/constant/env';
import { isError } from '@/lib/utils';
import { getPluginUploads } from '@/query/plugin';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Schematic`,
  };
}

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
};

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const plugins = await serverApi((axios) => getPluginUploads(axios, data));

  if (isError(plugins)) {
    return <ErrorScreen error={plugins} />;
  }

  return <Client plugins={plugins} />;
}

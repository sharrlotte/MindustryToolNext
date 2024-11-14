import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(user)/maps/page.client';
import env from '@/constant/env';
import { serverApi } from '@/action/action';
import { getMaps } from '@/query/map';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { isError } from '@/lib/utils';
import ErrorScreen from '@/components/common/error-screen';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Map`,
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

  const maps = await serverApi((axios) => getMaps(axios, data));

  if (isError(maps)) {
    return <ErrorScreen error={maps} />;
  }

  return <Client maps={maps} />;
}

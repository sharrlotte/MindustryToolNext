import { Metadata } from 'next/dist/types';

import env from '@/constant/env';
import ErrorScreen from '@/components/common/error-screen';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import Client from '@/app/[locale]/(admin)/admin/maps/page.client';
import { getMapUploads } from '@/query/map';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${env.webName} > Maps`,
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

  const maps = await serverApi((axios) => getMapUploads(axios, data));

  if (isError(maps)) {
    return <ErrorScreen error={maps} />;
  }

  return <Client maps={maps} />;
}

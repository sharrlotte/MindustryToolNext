import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(admin)/admin/maps/page.client';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, isError } from '@/lib/utils';
import { getMapUploads } from '@/query/map';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

export const revalidate = 3600;
export const experimental_ppr = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = await t('map');

  return {
    title: formatTitle(title),
  };
}

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
  params: Promise<{
    locale: Locale;
  }>;
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

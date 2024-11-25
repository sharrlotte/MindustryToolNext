import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(user)/schematics/page.client';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi, translate } from '@/action/action';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematics } from '@/query/schematic';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = await translate(locale, 'schematic');

  return {
    title: formatTitle(title),
  };
}

type Props = {
  searchParams: Promise<ItemPaginationQueryType>;
  params: Promise<{ locale: Locale }>;
};

export default async function Page({ searchParams }: Props) {
  const { data, success, error } = ItemPaginationQuery.safeParse(await searchParams);

  if (!success || !data) {
    return <ErrorScreen error={error} />;
  }

  const schematics = await serverApi((axios) => getSchematics(axios, data));

  if (isError(schematics)) {
    return <ErrorScreen error={schematics} />;
  }

  return <Client schematics={schematics} />;
}

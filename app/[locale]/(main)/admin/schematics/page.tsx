import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/admin/schematics/page.client';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, isError } from '@/lib/utils';
import { getSchematicUploads } from '@/query/schematic';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('schematic');

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

  const schematics = await serverApi((axios) => getSchematicUploads(axios, data));

  if (isError(schematics)) {
    return <ErrorScreen error={schematics} />;
  }

  return <Client schematics={schematics} params={data} />;
}

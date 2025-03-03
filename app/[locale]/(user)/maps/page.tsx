import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(user)/maps/page.client';

import ErrorScreen from '@/components/common/error-screen';
import { UploadIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';

import { serverApi } from '@/action/action';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, isError } from '@/lib/utils';
import { getMaps } from '@/query/map';
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
  params: Promise<{ locale: Locale }>;
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

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="map" />
      <div className="flex justify-end">
        <PaginationLayoutSwitcher />
      </div>
      <Client maps={maps} params={data} />
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={`${env.url.base}/upload/map`}>
          <UploadIcon className="size-5" />
          <Tran text="map.upload" />
        </InternalLink>
        <GridLayout>
          <PaginationNavigator numberOfItems="/maps/total" queryKey={['maps', 'total']} />
        </GridLayout>
      </div>
    </div>
  );
}

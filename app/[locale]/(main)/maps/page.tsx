import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/maps/page.client';

import { UploadIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';

import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale);
  const title = t('map');

  return {
    title: formatTitle(title),
    alternates: generateAlternate('/maps'),
  };
}

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="map" />
      <Client />
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={`${env.url.base}/upload/map`}>
          <UploadIcon className="size-5" />
          <Tran text="map.upload" />
        </InternalLink>
        <div className="flex justify-end items-center gap-2 flex-wrap">
          <PaginationLayoutSwitcher />
          <GridLayout>
            <PaginationNavigator numberOfItems="/maps/total" queryKey={['maps', 'total']} />
          </GridLayout>
        </div>
      </div>
    </div>
  );
}

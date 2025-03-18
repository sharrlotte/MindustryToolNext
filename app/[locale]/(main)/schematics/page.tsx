import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/schematics/page.client';

import { UploadIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';

import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, ['common', 'meta']);
  const title = t('schematic');

  return {
    title: formatTitle(title),
    description: t('meta-schematic-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('meta-schematic-description'),
    },
  };
}

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Page() {
  const uploadLink = `${env.url.base}/upload/schematic`;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-2">
      <NameTagSearch type="schematic" />

      <Client />
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <InternalLink variant="button-secondary" href={uploadLink}>
          <UploadIcon />
          <Tran text="upload-schematic" />
        </InternalLink>
        <div className="flex justify-end items-center gap-2">
          <PaginationLayoutSwitcher />
          <GridLayout>
            <PaginationNavigator numberOfItems="/schematics/total" queryKey={['schematics', 'total']} />
          </GridLayout>
        </div>
      </div>
    </div>
  );
}

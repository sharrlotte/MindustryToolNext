import { UploadIcon } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/maps/page.client';

import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationFooter, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';

import { getServerApi } from '@/action/common';
import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';
import { getMaps } from '@/query/map';

const getCachedMaps = unstable_cache(
	(axios) =>
		getMaps(axios, {
			page: 0,
			size: 100,
		}),
	['meta-maps'],
	{
		revalidate: 60 * 60,
	},
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('map');

	const axios = await getServerApi();
	const maps = await getCachedMaps(axios);

	return {
		title: formatTitle(title),
		description: t('map-description'),
		alternates: generateAlternate('/maps'),
		openGraph: {
			title: formatTitle(title),
			description: t('map-description'),
			images: maps.map(({ id }) => `${env.url.image}/maps/${id}${env.imageFormat}`),
		},
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
			<PaginationFooter>
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
			</PaginationFooter>
		</div>
	);
}

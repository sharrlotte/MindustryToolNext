import { UploadIcon } from 'lucide-react';
import { Metadata } from 'next/dist/types';

import Client from '@/app/[locale]/(main)/schematics/page.client';

import InternalLink from '@/components/common/internal-link';
import { GridLayout, PaginationFooter, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';

import env from '@/constant/env';
import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale, ['common', 'meta']);
	const title = t('schematic');

	return {
		title: formatTitle(title),
		description: t('schematic-description'),
		openGraph: {
			title: formatTitle(title),
			description: t('schematic-description'),
		},
		alternates: generateAlternate('/schematics'),
	};
}

type Props = {
	params: Promise<{ locale: Locale }>;
};

export default async function Page() {
	const uploadLink = `${env.url.base}/upload/schematic`;

	return (
		<div className="flex overflow-hidden flex-col gap-2 p-2 h-full">
			<NameTagSearch type="schematic" />
			<Client />
			<PaginationFooter>
				<InternalLink variant="button-secondary" href={uploadLink}>
					<UploadIcon />
					<Tran text="upload-schematic" />
				</InternalLink>
				<div className="flex flex-wrap gap-2 justify-end items-center">
					<PaginationLayoutSwitcher />
					<GridLayout>
						<PaginationNavigator numberOfItems="/schematics/total" queryKey={['schematics', 'total']} />
					</GridLayout>
				</div>
			</PaginationFooter>
		</div>
	);
}

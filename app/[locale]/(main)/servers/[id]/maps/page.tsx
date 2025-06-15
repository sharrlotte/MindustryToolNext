import { Metadata } from 'next';
import { Suspense } from 'react';
import React from 'react';

import MapList from '@/app/[locale]/(main)/servers/[id]/maps/map-list';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

import dynamic from 'next/dynamic';

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('map');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/maps`),
	};
}

const DownloadMapList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/maps/download-map-list'));

export default async function Page({ params }: Props) {
	const { id } = await params;
	return (
		<div className="h-full w-full overflow-hidden p-2 flex flex-col gap-2">
			<Suspense>
				<ServerTabs className="gap-2" name="tab" value="list" values={['list', 'download']}>
					<ServerTabsList className="border-none rounded-lg w-fit">
						<ServerTabsTrigger value="list">
							<Tran text="list" />
						</ServerTabsTrigger>
						<ServerTabsTrigger value="download">
							<Tran text="download" />
						</ServerTabsTrigger>
					</ServerTabsList>
					<Divider />
					<ScrollContainer>
						<Suspense>
							<ServerTabsContent value="list">
								<MapList id={id} />
							</ServerTabsContent>
							<ServerTabsContent value="download">
								<DownloadMapList />
							</ServerTabsContent>
						</Suspense>
					</ScrollContainer>
				</ServerTabs>
			</Suspense>
		</div>
	);
}

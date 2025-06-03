import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import PluginList from '@/app/[locale]/(main)/servers/[id]/plugins/plugin-list';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { generateAlternate } from '@/lib/i18n.utils';
import { formatTitle } from '@/lib/utils';

type Props = {
	params: Promise<{
		locale: Locale;
		id: string;
	}>;
};

const DownloadPluginList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/plugins/download-plugin-list'));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, locale } = await params;
	const { t } = await getTranslation(locale);
	const title = t('plugin');

	return {
		title: formatTitle(title),
		alternates: generateAlternate(`/servers/${id}/plugins`),
	};
}

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
						<ServerTabsContent value="list">
							<PluginList id={id} />
						</ServerTabsContent>
						<Suspense>
							<ServerTabsContent value="download">
								<DownloadPluginList />
							</ServerTabsContent>
						</Suspense>
					</ScrollContainer>
				</ServerTabs>
			</Suspense>
		</div>
	);
}

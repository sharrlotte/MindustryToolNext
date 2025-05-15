'use client';

import dynamic from 'next/dynamic';
import React from 'react';


import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import PluginList from '@/app/[locale]/(main)/servers/[id]/plugins/plugin-list';

type Props = {
	id: string;
};
const DownloadPluginList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/plugins/download-plugin-list'), { ssr: false });

export default function ServerPluginPage({ id }: Props) {
	return (
		<div className="h-full w-full overflow-hidden p-2 flex flex-col gap-2">
			<ServerTabs className="gap-2" name="tab" value="list" values={['list', 'download']}>
				<ServerTabsList className="border-none rounded-lg w-fit">
					<ServerTabsTrigger value="list">
						<Tran text="list" />
					</ServerTabsTrigger>
					<ServerTabsTrigger value="download">
						<Tran text="download" />
					</ServerTabsTrigger>
				</ServerTabsList>
				<ScrollContainer>
					<ServerTabsContent className="w-full gap-2 md:grid-cols-2 lg:grid-cols-3" display="grid" value="list">
						<PluginList id={id} />
					</ServerTabsContent>
					<ServerTabsContent className="h-full" value="download">
						<DownloadPluginList />
					</ServerTabsContent>
				</ScrollContainer>
			</ServerTabs>
		</div>
	);
}

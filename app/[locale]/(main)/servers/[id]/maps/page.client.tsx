import dynamic from 'next/dynamic';
import React from 'react';

import MapList from '@/app/[locale]/(main)/servers/[id]/maps/map-list';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';

type Props = {
	id: string;
};

const DownloadMapList = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/maps/download-map-list'));

export default function ServerMapPage({ id }: Props) {
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
				<Divider />
				<ScrollContainer>
					<ServerTabsContent value="list">
						<MapList id={id} />
					</ServerTabsContent>
					<ServerTabsContent value="download">
						<DownloadMapList />
					</ServerTabsContent>
				</ScrollContainer>
			</ServerTabs>
		</div>
	);
}

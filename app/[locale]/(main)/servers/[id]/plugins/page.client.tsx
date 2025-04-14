'use client';

import React from 'react';

import AddPluginDialog from '@/app/[locale]/(main)/servers/[id]/plugins/add-plugin-dialog';

import InfinitePage from '@/components/common/infinite-page';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import ServerPluginCard from '@/components/server/server-plugin-card';
import { Skeleton } from '@/components/ui/skeleton';

import { getServerPluginCount, getServerPlugins } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

type Props = {
	id: string;
};

export default function ServerPluginPage({ id }: Props) {
	return (
		<>
			<ScrollContainer className="flex h-full w-full flex-col gap-2">
				<InfinitePage
					className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
					paramSchema={PaginationQuerySchema}
					queryKey={['servers', id, 'plugins']}
					queryFn={(axios, params) => getServerPlugins(axios, id, params)}
					skeleton={{
						amount: 20,
						item: <Skeleton className="h-32 w-full" />,
					}}
				>
					{(data) => <ServerPluginCard key={data.id} plugin={data} />}
				</InfinitePage>
			</ScrollContainer>
			<div className="flex justify-between gap-2 items-center">
				<AddPluginDialog serverId={id} />
				<div className="flex gap-2">
					<PaginationNavigator numberOfItems={(axios, params) => getServerPluginCount(axios, id, params)} queryKey={['servers', id, 'plugins', 'total']} />
				</div>
			</div>
		</>
	);
}

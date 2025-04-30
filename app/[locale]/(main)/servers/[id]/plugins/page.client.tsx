'use client';

import React from 'react';

import AddPluginDialog from '@/app/[locale]/(main)/servers/[id]/plugins/add-plugin-dialog';

import InfinitePage from '@/components/common/infinite-page';
import { PaginationFooter } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import ServerPluginCard from '@/components/server/server-plugin-card';

import { getServerPluginCount, getServerPlugins } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

type Props = {
	id: string;
};

export default function ServerPluginPage({ id }: Props) {
	return (
		<>
			<ScrollContainer>
				<InfinitePage
					className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
					paramSchema={PaginationQuerySchema}
					queryKey={['servers', id, 'plugins']}
					queryFn={(axios, params) => getServerPlugins(axios, id, params)}
				>
					{(data) => <ServerPluginCard key={data.id} plugin={data} />}
				</InfinitePage>
			</ScrollContainer>
			<PaginationFooter>
				<AddPluginDialog serverId={id} />
				<PaginationNavigator
					numberOfItems={(axios, params) => getServerPluginCount(axios, id, params)}
					queryKey={['servers', id, 'plugins', 'total']}
				/>
			</PaginationFooter>
		</>
	);
}

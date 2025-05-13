'use client';

import React from 'react';

import AddMapDialog from '@/app/[locale]/(main)/servers/[id]/maps/add-map-dialog';

import InfinitePage from '@/components/common/infinite-page';
import { PaginationFooter } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import ServerMapCard from '@/components/server/server-map-card';

import { getServerMapCount, getServerMaps } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

type Props = {
	id: string;
};

export default function ServerMaps({ id }: Props) {
	return (
		<div className="h-full w-full overflow-hidden p-2 flex flex-col gap-2">
			<ScrollContainer>
				<InfinitePage
					paramSchema={PaginationQuerySchema}
					queryKey={['servers', id, 'maps']}
					queryFn={(axios, params) => getServerMaps(axios, id, params)}
				>
					{(page) => page.map((data) => <ServerMapCard key={data.id} map={data} />)}
				</InfinitePage>
			</ScrollContainer>
			<PaginationFooter>
				<AddMapDialog serverId={id} />
				<PaginationNavigator
					numberOfItems={(axios, params) => getServerMapCount(axios, id, params)}
					queryKey={['servers', id, 'maps', 'total']}
				/>
			</PaginationFooter>
		</div>
	);
}

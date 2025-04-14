'use client';

import React from 'react';

import AddMapDialog from '@/app/[locale]/(main)/servers/[id]/maps/add-map-dialog';

import InfinitePage from '@/components/common/infinite-page';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import ServerMapCard from '@/components/server/server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import { getServerMapCount, getServerMaps } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

type Props = {
	id: string;
};

export default function ServerMaps({ id }: Props) {
	return (
		<>
			<ScrollContainer className="flex h-full w-full flex-col gap-2">
				<InfinitePage
					paramSchema={PaginationQuerySchema}
					queryKey={['servers', id, 'maps']}
					queryFn={(axios, params) => getServerMaps(axios, id, params)}
					skeleton={{
						amount: 20,
						item: <PreviewSkeleton />,
					}}
				>
					{(data) => <ServerMapCard key={data.id} map={data} />}
				</InfinitePage>
			</ScrollContainer>
			<div className="flex justify-between gap-2 items-center">
				<AddMapDialog serverId={id} />
				<div className="flex gap-2">
					<PaginationNavigator numberOfItems={(axios, params) => getServerMapCount(axios, id, params)} queryKey={['servers', id, 'maps', 'total']} />
				</div>
			</div>
		</>
	);
}

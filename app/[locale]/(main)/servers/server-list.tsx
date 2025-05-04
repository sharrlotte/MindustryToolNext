'use client';

import InfinitePage from '@/components/common/infinite-page';
import ServerCard from '@/components/server/server-card';
import ServerCardSkeleton from '@/components/server/server-card.skeleton';

import { getServers } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

export default function ServerList() {
	return (
		<InfinitePage
			className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2"
			queryKey={['server']}
			skeleton={{ item: <ServerCardSkeleton />, amount: 20 }}
			paramSchema={PaginationQuerySchema}
			queryFn={(axios, { size, page }) => getServers(axios, { page, size })}
		>
			{page =>  page.map((server) => <ServerCard server={server} key={server.port} />)}
		</InfinitePage>
	);
}

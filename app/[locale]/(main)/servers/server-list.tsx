'use client';

import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { SearchIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import ServerCard from '@/components/server/server-card';
import ServerCardSkeleton from '@/components/server/server-card.skeleton';

import { getServers } from '@/query/server';
import { PaginationQuerySchema } from '@/types/schema/search-query';

export default function ServerList() {
	const [name, setName] = useState('');

	const [debounced] = useDebounceValue(name, 200);

	return (
		<div className="flex h-full w-full gap-2 flex-col">
			<SearchBar className="max-w-xl bg-card">
				<SearchIcon />
				<SearchInput value={name} onChange={setName} />
			</SearchBar>
			<ScrollContainer>
				<InfinitePage
					className="grid h-full w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2"
					queryKey={['server', debounced]}
					skeleton={{ item: <ServerCardSkeleton />, amount: 20 }}
					paramSchema={PaginationQuerySchema}
					queryFn={(axios, { size, page }) => getServers(axios, { page, size, name: debounced })}
				>
					{(page) => page.map((server) => <ServerCard server={server} key={server.port} />)}
				</InfinitePage>
			</ScrollContainer>
		</div>
	);
}

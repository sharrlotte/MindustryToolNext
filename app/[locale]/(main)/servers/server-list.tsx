'use client';

import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import ServerCard from '@/components/server/server-card';
import ServerCardSkeleton from '@/components/server/server-card.skeleton';

import { PaginationQuerySchema } from '@/types/schema/search-query';

import { getServers } from '@/query/server';

export default function ServerList() {
	const [name, setName] = useState('');
	const [debounced] = useDebounceValue(name, 200);

	return (
		<div className="flex h-full w-full gap-2 flex-col overflow-hidden p-2">
			<SearchBar className="bg-card">
				<SearchIcon />
				<SearchInput value={name} onChange={setName} />
			</SearchBar>
			<ScrollContainer>
				<InfinitePage
					className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(400px,100%),1fr))] gap-2"
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

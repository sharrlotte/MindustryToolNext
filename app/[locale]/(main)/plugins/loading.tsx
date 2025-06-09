import React from 'react';

import PluginCardSkeleton from '@/components/plugin/plugin-card.skeleton';
import NameTagSearchSkeleton from '@/components/search/name-tag-search-skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-col gap-2 p-2">
			<NameTagSearchSkeleton />
			<div className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-3">
				<Skeletons number={20}>
					<PluginCardSkeleton />
				</Skeletons>
			</div>
		</div>
	);
}

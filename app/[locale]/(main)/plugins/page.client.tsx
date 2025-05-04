'use client';

import React from 'react';

import AddPluginDialog from '@/app/[locale]/(main)/plugins/add-plugin.dialog';

import InfinitePage from '@/components/common/infinite-page';
import { PaginationFooter, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import PluginCard from '@/components/plugin/plugin-card';
import PluginCardSkeleton from '@/components/plugin/plugin-card.skeleton';
import NameTagSearch from '@/components/search/name-tag-search';

import { getPluginCount, getPlugins } from '@/query/plugin';
import { ItemPaginationQuery } from '@/types/schema/search-query';

export default function Client() {
	return (
		<div className="flex h-full flex-col justify-between gap-2 p-2">
			<NameTagSearch type="plugin" useSort={false} />
			<ScrollContainer className="relative flex h-full flex-col">
				<InfinitePage
					className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
					queryKey={['plugins']}
					queryFn={getPlugins}
					paramSchema={ItemPaginationQuery}
					skeleton={{
						amount: 20,
						item: <PluginCardSkeleton />,
					}}
				>
					{(page) => page.map((data) => <PluginCard key={data.id} plugin={data} />)}
				</InfinitePage>
			</ScrollContainer>
			<PaginationFooter>
				<AddPluginDialog />
				<div className="flex justify-end items-center gap-2 flex-wrap">
					<PaginationLayoutSwitcher />
					<PaginationNavigator numberOfItems={getPluginCount} queryKey={['plugin', 'total']} />
				</div>
			</PaginationFooter>
		</div>
	);
}

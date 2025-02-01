'use client';

import React from 'react';

import AddPluginDialog from '@/app/[locale]/(user)/plugins/add-plugin-dialog';

import InfinitePage from '@/components/common/infinite-page';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import PluginCard from '@/components/plugin/plugin-card';
import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';
import NameTagSearch from '@/components/search/name-tag-search';

import { getPluginCount, getPlugins } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';
import { Plugin } from '@/types/response/Plugin';

type Props = {
  plugins: Plugin[];
};

export default function Client({ plugins }: Props) {
  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <NameTagSearch type="plugin" useSort={false} />
      <ScrollContainer className="relative flex h-full flex-col">
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['plugins']}
          queryFn={getPlugins}
          paramSchema={ItemPaginationQuery}
          initialData={plugins}
          skeleton={{
            amount: 20,
            item: <PluginCardSkeleton />,
          }}
        >
          {(data) => <PluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex justify-between">
        <AddPluginDialog />
        <PaginationNavigator numberOfItems={getPluginCount} queryKey={['plugin', 'total']} />
      </div>
    </div>
  );
}

'use client';

import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import PluginCard from '@/components/plugin/plugin-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useTags from '@/hooks/use-tags';

import { getPlugins } from '@/query/plugin';
import AddPluginForm from '@/app/[locale]/(user)/plugins/add-plugin-form';
import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';
import ScrollContainer from '@/components/common/scroll-container';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';

export default function PageClient() {
  const {
    searchTags: { plugin },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <NameTagSearch tags={plugin} useSort={false} />
      <ScrollContainer className="relative flex h-full flex-col overflow-y-auto" ref={ref}>
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          container={() => ref.current}
          skeleton={{
            amount: 20,
            item: <PluginCardSkeleton />,
          }}
        >
          {(data) => <PluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex justify-end">
        <AddPluginForm />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import PluginCard from '@/components/plugin/plugin-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';

import { getPlugins } from '@/query/plugin';
import AddPluginForm from '@/app/[locale]/(user)/plugins/add-plugin-form';
import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';

export default function PageClient() {
  const { plugin } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <NameTagSearch tags={plugin} useSort={false} />
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          container={() => container}
          skeleton={{
            amount: 20,
            item: <PluginCardSkeleton />,
          }}
        >
          {(data) => <PluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </div>
      <div className="flex justify-end">
        <AddPluginForm />
      </div>
    </div>
  );
}

'use client';

import InfinitePage from '@/components/common/infinite-page';
import PluginCard from '@/components/plugin/plugin-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import useTags from '@/hooks/use-tags';
import getPlugins from '@/query/plugin/get-plugins';
import React, { useRef } from 'react';

export default function Page() {
  const { plugin } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={plugin} useSort={false} />
      <InfinitePage
        queryKey={['plugins']}
        getFunc={getPlugins}
        params={params}
        scrollContainer={scrollContainer.current}
        skeleton={{
          amount: 20,
          item: <PreviewSkeleton />,
        }}
      >
        {(data) => <PluginCard key={data.id} plugin={data} />}
      </InfinitePage>
    </div>
  );
}

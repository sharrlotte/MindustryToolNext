'use client';

import React, { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import UploadPluginCard from '@/components/plugin/upload-plugin-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import { useTags } from '@/context/tags-context.client';
import useSearchQuery from '@/hooks/use-search-query';
import { getPluginUploads } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';
import ScrollContainer from '@/components/common/scroll-container';

export default function Client() {
  const {
    searchTags: { plugin },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-2 p-2">
      <NameTagSearch tags={plugin} />
      <ScrollContainer className="relative flex h-full flex-col gap-2" ref={(ref) => setContainer(ref)}>
        <InfinitePage queryKey={['plugins', 'upload']} queryFn={getPluginUploads} params={params} container={() => container}>
          {(data) => <UploadPluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}

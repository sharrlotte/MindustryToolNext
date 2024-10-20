'use client';

import React, { useState } from 'react';

import UploadPluginCard from '@/components/plugin/upload-plugin-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import { useSearchTags } from '@/hooks/use-tags';
import { getPluginUploads } from '@/query/plugin';
import InfinitePage from '@/components/common/infinite-page';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';

export default function Page() {
  const { plugin } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-2 p-2">
      <NameTagSearch tags={plugin} />
      <div className="relative flex h-full flex-col gap-2 overflow-y-auto" ref={(ref) => setContainer(ref)}>
        <InfinitePage queryKey={['plugins', 'upload']} getFunc={getPluginUploads} params={params} container={() => container}>
          {(data) => <UploadPluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}

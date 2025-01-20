'use client';

import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import UploadPluginCard from '@/components/plugin/upload-plugin-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import useSearchQuery from '@/hooks/use-search-query';
import { getPluginUploads } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';
import { Plugin } from '@/types/response/Plugin';

type Props = {
  plugins: Plugin[];
};

export default function Client({ plugins }: Props) {
  const params = useSearchQuery(ItemPaginationQuery);
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-2 p-2">
      <NameTagSearch type="plugin" />
      <ScrollContainer className="relative flex h-full flex-col gap-2" ref={container}>
        <InfinitePage queryKey={['plugins', 'upload']} queryFn={getPluginUploads} params={params} container={() => container.current} initialData={plugins}>
          {(data) => <UploadPluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}

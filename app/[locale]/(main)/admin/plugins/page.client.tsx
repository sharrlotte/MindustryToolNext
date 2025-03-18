'use client';

import React from 'react';

import InfinitePage from '@/components/common/infinite-page';
import { PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import UploadPluginCard from '@/components/plugin/upload-plugin-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import { getPluginUploads } from '@/query/plugin';
import { ItemPaginationQuery } from '@/query/search-query';

export default function Client() {
  return (
    <div className="relative flex h-full flex-col gap-2 p-2">
      <NameTagSearch type="plugin" />
      <div className="flex justify-end items-center">
        <PaginationLayoutSwitcher />
      </div>
      <ScrollContainer className="relative flex h-full flex-col gap-2">
        <InfinitePage queryKey={['plugins', 'upload']} queryFn={getPluginUploads} paramSchema={ItemPaginationQuery}>
          {(data) => <UploadPluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}

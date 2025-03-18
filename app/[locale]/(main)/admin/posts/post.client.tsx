'use client';

import React from 'react';

import InfinitePage from '@/components/common/infinite-page';
import { PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import UploadPostPreviewCard from '@/components/post/upload-post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import { getPostUploads } from '@/query/post';
import { ItemPaginationQuery } from '@/query/search-query';

export default function Client() {
  return (
    <div className="p-2">
      <NameTagSearch type="post" />
      <ScrollContainer className="relative flex h-full flex-col gap-2 p-2">
        <InfinitePage className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2" paramSchema={ItemPaginationQuery} queryKey={['posts', 'upload']} queryFn={getPostUploads}>
          {(data) => <UploadPostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex justify-end items-center">
        <PaginationLayoutSwitcher />
      </div>
    </div>
  );
}

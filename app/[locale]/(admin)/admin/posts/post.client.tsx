'use client';

import React, { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import UploadPostPreviewCard from '@/components/post/upload-post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import useSearchQuery from '@/hooks/use-search-query';
import { getPostUploads } from '@/query/post';
import { ItemPaginationQuery } from '@/query/search-query';
import { Post } from '@/types/response/Post';

type Props = {
  posts: Post[];
};

export default function Client({ posts }: Props) {
  const params = useSearchQuery(ItemPaginationQuery);
  const container = useRef<HTMLDivElement | null>(null);
  return (
    <div className="p-2">
      <NameTagSearch type="post" />
      <ScrollContainer className="relative flex h-full flex-col gap-2 p-2" ref={container}>
        <InfinitePage
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
          params={params}
          queryKey={['posts', 'upload']}
          queryFn={getPostUploads}
          initialData={posts}
          container={() => container.current}
        >
          {(data) => <UploadPostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </ScrollContainer>
    </div>
  );
}

'use client';

import InfinitePage from '@/components/common/infinite-page';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import PostPreviewCard from '@/components/post/post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getPosts from '@/query/post/get-posts';

import { useRef } from 'react';

export default function PostsPage() {
  const { post } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <NameTagSearch tags={post} />
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        ref={container}
      >
        <ResponsiveInfiniteScrollGrid
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-4"
          params={params}
          queryKey={['posts']}
          getFunc={getPosts}
          container={() => container.current}
          itemMinWidth={320}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <PostPreviewCard key={data.id} post={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}

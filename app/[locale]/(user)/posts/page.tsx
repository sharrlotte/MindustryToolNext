'use client';

import getPosts from '@/query/post/get-posts';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useSearchPageParams from '@/hooks/use-search-page-params';
import PostPreviewCard from '@/components/post/post-preview-card';
import { useSearchTags } from '@/hooks/use-tags';
import { useRef } from 'react';

export default function PostsPage() {
  const { post } = useSearchTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <NameTagSearch tags={post} />
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        ref={(ref) => {
          scrollContainer.current = ref;
        }}
      >
        <InfinitePage
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-4"
          params={params}
          queryKey={['posts']}
          getFunc={getPosts}
          scrollContainer={scrollContainer.current}
        >
          {(data) => <PostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}

'use client';

import getPosts from '@/query/post/get-posts';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';
import useSearchPageParams from '@/hooks/use-search-page-params';
import PostPreviewCard from '@/components/post/post-preview-card';

export default function PostsPage() {
  const { post } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={post} />
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
  );
}

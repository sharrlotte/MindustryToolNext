'use client';

import PostPreview from '@/components/post/post-preview';
import getPosts from '@/query/post/get-posts';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';

export default function PostsPage() {
  const { data } = useTags();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex flex-col gap-4 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={data?.post} />
      <InfinitePage
        className="flex flex-col gap-2"
        queryKey={['posts']}
        getFunc={getPosts}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <PostPreview key={data.id} post={data} />}
      </InfinitePage>
    </div>
  );
}

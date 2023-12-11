'use client';

import PostPreview from '@/components/post/post-preview';
import getPosts from '@/query/post/get-posts';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';

export default function PostsPage() {
  const { data } = useTags();

  return (
    <div className="flex flex-col gap-4">
      <NameTagSearch tags={data?.post} />
      <InfinitePage
        className="flex flex-col gap-2"
        queryKey={['posts']}
        getFunc={getPosts}
      >
        {(data) => <PostPreview post={data} />}
      </InfinitePage>
    </div>
  );
}

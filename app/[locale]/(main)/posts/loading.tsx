import React from 'react';

import PostCardSkeleton from '@/components/post/post-card-skeleton';
import NameTagSearchSkeleton from '@/components/search/name-tag-search-skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <NameTagSearchSkeleton />
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2">
        <Skeletons number={20}>
          <PostCardSkeleton />
        </Skeletons>
      </div>
    </div>
  );
}

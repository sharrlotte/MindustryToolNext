  'use client';

import { useRef } from 'react';

import PostPreviewCard from '@/components/post/post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import { searchTags } from '@/query/tags';
import { getPosts } from '@/query/post';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { UserIcon, UploadIcon } from 'lucide-react';
import env from '@/constant/env';
import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';

export default function PostsPage() {
  const { post } = searchTags;
  const params = useSearchQuery(ItemPaginationQuery);
  const ref = useRef<HTMLDivElement | null>(null);

  const uploadLink = `${env.url.base}/upload/post`;
  const myPostLink = `${env.url.base}/users/@me`;
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch tags={post} />
      <ScrollContainer ref={ref}>
        <InfinitePage
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
          params={params}
          queryKey={['posts']}
          getFunc={getPosts}
          container={() => ref.current}
        >
          {(data) => <PostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex gap-2">
        <InternalLink variant="button-secondary" title="my-post" href={myPostLink}>
          <UserIcon />
          <Tran text="my-post" />
        </InternalLink>
        <InternalLink variant="button-secondary" title="upload-post" href={uploadLink}>
          <UploadIcon />
          <Tran text="upload-post" />
        </InternalLink>
      </div>
    </div>
  );
}

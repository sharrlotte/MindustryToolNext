'use client';

import { useState } from 'react';

import PostPreviewCard from '@/components/post/post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { getPosts } from '@/query/post';
import InternalLink from '@/components/common/internal-link';
import Tran from '@/components/common/tran';
import { UserIcon, UploadIcon } from 'lucide-react';
import env from '@/constant/env';
import InfinitePage from '@/components/common/infinite-page';

export default function PostsPage() {
  const { post } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const uploadLink = `${env.url.base}/upload/post`;
  const myPostLink = `${env.url.base}/users/@me`;
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <NameTagSearch tags={post} />
      <div
        className="flex h-full w-full flex-col overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(450px,100%),1fr))] justify-center gap-2"
          params={params}
          queryKey={['posts']}
          getFunc={getPosts}
          container={() => container}
        >
          {(data) => <PostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </div>
      <div className="flex gap-2">
        <InternalLink
          variant="button-secondary"
          title="my-post"
          href={myPostLink}
        >
          <UserIcon />
          <Tran text="my-post" />
        </InternalLink>
        <InternalLink
          variant="button-secondary"
          title="upload-post"
          href={uploadLink}
        >
          <UploadIcon />
          <Tran text="upload-post" />
        </InternalLink>
      </div>
    </div>
  );
}

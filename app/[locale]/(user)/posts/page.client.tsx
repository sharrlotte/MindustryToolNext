'use client';

import { UploadIcon, UserIcon } from 'lucide-react';
import { useRef } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import PostPreviewCard from '@/components/post/post-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';

import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import { useTags } from '@/context/tags-context.client';
import useSearchQuery from '@/hooks/use-search-query';
import ProtectedElement from '@/layout/protected-element';
import { getPosts } from '@/query/post';
import { ItemPaginationQuery } from '@/query/search-query';
import { Post } from '@/types/response/Post';

type Props = {
  posts: Post[];
};

export default function Client({ posts }: Props) {
  const {
    searchTags: { post },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const ref = useRef<HTMLDivElement | null>(null);
  const { session } = useSession();

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
          queryFn={getPosts}
          container={() => ref.current}
          initialData={posts}
        >
          {(data) => <PostPreviewCard key={data.id} post={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex gap-2">
        <ProtectedElement session={session} filter>
          <InternalLink variant="button-secondary" title="my-post" href={myPostLink}>
            <UserIcon />
            <Tran text="my-post" />
          </InternalLink>
        </ProtectedElement>
        <InternalLink variant="button-secondary" title="upload-post" href={uploadLink}>
          <UploadIcon />
          <Tran text="upload-post" />
        </InternalLink>
      </div>
    </div>
  );
}

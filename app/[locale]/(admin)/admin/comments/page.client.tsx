'use client';

import React, { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';

import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { ItemPaginationQuery } from '@/query/search-query';

import { getAllCommentCount, getAllComments } from '@/query/comment';
import { Comment } from '@/types/response/Comment';
import Markdown from '@/components/markdown/markdown';
import { RelativeTime } from '@/components/common/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import { getUser } from '@/query/user';


export default function Client() {
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['comments', omit(params, 'page', 'size')],
    queryFn: (axios) => getAllCommentCount(axios),
    placeholderData: 0,
  });


  return (
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <ScrollContainer className="relative flex h-full flex-col" ref={(ref) => setContainer(ref)}>
          <ListLayout>
            <InfinitePage
            className='flex flex-col gap-1'
              params={params}
              queryKey={['comments']}
              queryFn={getAllComments}
              container={() => container}

            >
              {(data) => <CommentCard key={data.id} comment={data} />}
            </InfinitePage>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
            className='flex flex-col gap-1'
params={params}
              queryKey={['comments']}
              queryFn={getAllComments}
            >
              {(data) => <CommentCard key={data.id} comment={data} />}
            </GridPaginationList>
          </GridLayout>
        </ScrollContainer>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <GridLayout>
            <PaginationNavigator numberOfItems={data} />
          </GridLayout>
        </div>
      </div>
  );
}


type CommentCardProps = {
  comment: Comment
}

function CommentCard({comment} : CommentCardProps){
const { userId, content, createdAt } = comment;

  const { data } = useClientQuery({
    queryKey: ['users', userId],
    queryFn: (axios) => getUser(axios, { id: userId }),
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full gap-2 text-wrap items-center text-xs">
        {data ? <UserAvatar user={data} url /> : <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />}
        <div className="overflow-hidden">
          <div className="flex gap-2 items-baseline">
            {data ? (
              <ColorAsRole className="font-semibold capitalize text-base" roles={data.roles}>
                {data.name}
              </ColorAsRole>
            ) : (
              <Skeleton className="h-4 max-h-1 w-24" />
            )}
            <RelativeTime className="text-muted-foreground" date={new Date(createdAt)} />
          </div>
        </div>
      </div>
      <Markdown className="ml-10 text-sm">{content}</Markdown>
    </div>
  )  
}

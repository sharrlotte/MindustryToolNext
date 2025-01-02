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

  return     <div className="flex items-center gap-2 p-2">
    {comment.content}
  </div>;
}

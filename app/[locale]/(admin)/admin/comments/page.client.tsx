'use client';

import React, { useState } from 'react';

import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { toast } from '@/components/ui/sonner';

import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { deleteMap,  } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';

import { useMutation } from '@tanstack/react-query';
import { getAllCommentCount, getAllComments } from '@/query/comment';
import { Comment } from '@/types/response/Comment';


export default function Client() {
  const {
    searchTags: { map },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['comments', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getAllCommentCount(axios),
    placeholderData: 0,
  });

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteMap(axios, id))),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['maps']);
    },
  });

  async function handleBulkDelete(value: string[]) {
    mutate(value);
  }

  return (
    <BulkActionContainer onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch tags={map} />
        <div className="flex items-center justify-between">
          <Tran className="text-muted-foreground" text="found" args={{ number: data }} />
          <div className="flex items-center gap-2">
            <BulkDeleteToggle />
            <PaginationLayoutSwitcher />
          </div>
        </div>
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
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <GridLayout>
            <PaginationNavigator numberOfItems={data} />
          </GridLayout>
        </div>
      </div>
    </BulkActionContainer>
  );
}


type CommentCardProps = {
  comment: Comment
}

function CommentCard({comment} : CommentCardProps){

  return     <div className="flex items-center gap-2 p-2"></div>;
}

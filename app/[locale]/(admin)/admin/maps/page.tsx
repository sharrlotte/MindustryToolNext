'use client';

import React, { useState } from 'react';

import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { deleteMap, getMapUploadCount, getMapUploads } from '@/query/map';
import GridPaginationList from '@/components/common/grid-pagination-list';
import { PaginationLayoutSwitcher, ListLayout, GridLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import useClientQuery from '@/hooks/use-client-query';
import { omit } from 'lodash';
import Tran from '@/components/common/tran';
import InfinitePage from '@/components/common/infinite-page';
import useQueriesData from '@/hooks/use-queries-data';
import useClientApi from '@/hooks/use-client';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';
import useTags from '@/hooks/use-tags';

export default function Page() {
  const {
    searchTags: { map },
  } = useTags();
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['maps', 'total', 'upload', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getMapUploadCount(axios, params),
    placeholderData: 0,
  });

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteMap(axios, id))),
    onSuccess: () => {
      toast({
        title: <Tran text="delete-success" />,
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: <Tran text="delete-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['maps']);
    },
  });

  async function handleBulkDelete(value: string[]) {
    mutate(value);
  }

  let imageCount = 0;

  return (
    <BulkActionContainer onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch tags={map} />
        <div className="flex items-center justify-between">
          <Tran text="found" args={{ number: data }} />
          <div className="flex items-center gap-2">
            <BulkDeleteToggle />
            <PaginationLayoutSwitcher />
          </div>
        </div>
        <ListLayout>
          <div className="relative flex h-full flex-col overflow-auto" ref={(ref) => setContainer(ref)}>
            <InfinitePage
              params={params}
              queryKey={['maps', 'upload']}
              getFunc={getMapUploads}
              container={() => container}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadMapPreviewCard key={data.id} map={data} imageCount={imageCount++} />}
            </InfinitePage>
          </div>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            params={params}
            queryKey={['maps', 'upload']}
            getFunc={getMapUploads}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <UploadMapPreviewCard key={data.id} map={data} imageCount={imageCount++} />}
          </GridPaginationList>
        </GridLayout>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-row-reverse sm:justify-between">
          <GridLayout>
            <PaginationNavigator numberOfItems={data} />
          </GridLayout>
        </div>
      </div>
    </BulkActionContainer>
  );
}

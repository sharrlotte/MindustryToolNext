'use client';

import React from 'react';

import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteMap, getMapUploadCount, getMapUploads } from '@/query/map';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { Map } from '@/types/response/Map';

import { useMutation } from '@tanstack/react-query';

type Props = {
  maps: Map[];
  params: ItemPaginationQueryType;
};

export default function Client({ maps, params }: Props) {
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
    <BulkActionContainer variant="destructive" onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch type="map" />
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <BulkDeleteToggle />
            <PaginationLayoutSwitcher />
          </div>
        </div>
        <ScrollContainer className="relative flex h-full flex-col">
          <ListLayout>
            <InfinitePage
              paramSchema={ItemPaginationQuery}
              queryKey={['maps', 'upload']}
              queryFn={getMapUploads}
              initialData={maps}
              initialParams={params}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
            </InfinitePage>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
              paramSchema={ItemPaginationQuery}
              queryKey={['maps', 'upload']}
              queryFn={getMapUploads}
              initialData={maps}
              initialParams={params}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
            </GridPaginationList>
          </GridLayout>
        </ScrollContainer>
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <GridLayout>
            <PaginationNavigator numberOfItems={getMapUploadCount} queryKey={['maps', 'total', 'upload']} />
          </GridLayout>
        </div>
      </div>
    </BulkActionContainer>
  );
}

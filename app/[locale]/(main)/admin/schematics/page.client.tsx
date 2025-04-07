'use client';

import React from 'react';

import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteSchematic, getSchematicUploadCount, getSchematicUploads } from '@/query/schematic';
import { ItemPaginationQuery } from '@/query/search-query';

import { useMutation } from '@tanstack/react-query';

export default function Client() {
  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteSchematic(axios, id))),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['schematics']);
    },
  });

  async function handleBulkDelete(value: string[]) {
    mutate(value);
  }

  return (
    <BulkActionContainer variant="destructive" onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch type="schematic" />
        <ScrollContainer className="relative flex h-full flex-col">
          <ListLayout>
            <InfinitePage
              paramSchema={ItemPaginationQuery}
              queryKey={['schematics', 'upload']}
              queryFn={getSchematicUploads}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadSchematicPreviewCard key={data.id} schematic={data} />}
            </InfinitePage>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
              paramSchema={ItemPaginationQuery}
              queryKey={['schematics', 'upload']}
              queryFn={getSchematicUploads}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadSchematicPreviewCard key={data.id} schematic={data} />}
            </GridPaginationList>
          </GridLayout>
        </ScrollContainer>
        <div className="flex items-center gap-2 justify-between">
          <BulkDeleteToggle />
          <div className="flex items-center gap-2">
            <PaginationLayoutSwitcher />
            <GridLayout>
              <PaginationNavigator numberOfItems={getSchematicUploadCount} queryKey={['schematics', 'total', 'upload']} />
            </GridLayout>
          </div>
        </div>
      </div>
    </BulkActionContainer>
  );
}

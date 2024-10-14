'use client';

import React, { useState } from 'react';

import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { useSearchTags } from '@/hooks/use-tags';
import GridPaginationList from '@/components/common/grid-pagination-list';
import { PaginationLayoutSwitcher, ListLayout, GridLayout } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import { deleteSchematic, getSchematicUploadCount, getSchematicUploads } from '@/query/schematic';
import { omit } from '@/lib/utils';
import Tran from '@/components/common/tran';
import InfinitePage from '@/components/common/infinite-page';
import { BulkActionContainer, BulkDeleteToggle } from '@/components/common/bulk-action';
import { useMutation } from '@tanstack/react-query';
import useClientApi from '@/hooks/use-client';
import { toast } from '@/hooks/use-toast';
import useQueriesData from '@/hooks/use-queries-data';

export default function Page() {
  const { schematic } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['schematics', 'total', 'upload', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getSchematicUploadCount(axios, params),
    placeholderData: 0,
  });

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => deleteSchematic(axios, id))),
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
      invalidateByKey(['schematics']);
    },
  });

  async function handleBulkDelete(value: string[]) {
    mutate(value);
  }

  return (
    <BulkActionContainer onActionPerform={handleBulkDelete}>
      <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
        <NameTagSearch tags={schematic} />
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
              queryKey={['schematics', 'upload']}
              getFunc={getSchematicUploads}
              container={() => container}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data) => <UploadSchematicPreviewCard key={data.id} schematic={data} />}
            </InfinitePage>
          </div>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            params={params}
            queryKey={['schematics', 'upload']}
            getFunc={getSchematicUploads}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <UploadSchematicPreviewCard key={data.id} schematic={data} />}
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

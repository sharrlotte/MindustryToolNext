'use client';

import React, { useState } from 'react';

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

import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useClientQuery from '@/hooks/use-client-query';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { deleteSchematic, getSchematicUploadCount, getSchematicUploads } from '@/query/schematic';
import { ItemPaginationQuery } from '@/query/search-query';
import { Schematic } from '@/types/response/Schematic';

import { useMutation } from '@tanstack/react-query';

type Props = {
  schematics: Schematic[];
};

export default function Client({ schematics }: Props) {
  const {
    searchTags: { schematic },
  } = useTags();
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
        <NameTagSearch tags={schematic} />
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <BulkDeleteToggle />
            <PaginationLayoutSwitcher />
          </div>
        </div>
        <ScrollContainer className="relative flex h-full flex-col" ref={(ref) => setContainer(ref)}>
          <ListLayout>
            <InfinitePage
              params={params}
              queryKey={['schematics', 'upload']}
              queryFn={getSchematicUploads}
              container={() => container}
              initialData={schematics}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => <UploadSchematicPreviewCard key={data.id} schematic={data} imageCount={index} />}
            </InfinitePage>
          </ListLayout>
          <GridLayout>
            <GridPaginationList
              params={params}
              queryKey={['schematics', 'upload']}
              queryFn={getSchematicUploads}
              initialData={schematics}
              skeleton={{
                amount: 20,
                item: <PreviewSkeleton />,
              }}
            >
              {(data, index) => <UploadSchematicPreviewCard key={data.id} schematic={data} imageCount={index} />}
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

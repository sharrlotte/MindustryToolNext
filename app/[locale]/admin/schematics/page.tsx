'use client';

import React, { useState } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { useSearchTags } from '@/hooks/use-tags';
import GridPaginationList from '@/components/common/grid-pagination-list';
import {
  PaginationLayoutSwitcher,
  ListLayout,
  GridLayout,
} from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { ItemPaginationQuery } from '@/query/search-query';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import {
  getSchematicUploadCount,
  getSchematicUploads,
} from '@/query/schematic';
import { omit } from '@/lib/utils';

export default function Page() {
  const { schematic } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: [
      'schematics',
      'total',
      'upload',
      omit(params, 'page', 'size', 'sort'),
    ],
    queryFn: (axios) => getSchematicUploadCount(axios, params),
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
      <div className="flex justify-between">
        <span>Found {data} schematics</span>
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div
          className="relative flex h-full flex-col overflow-auto"
          ref={(ref) => setContainer(ref)}
        >
          <ResponsiveInfiniteScrollGrid
            params={params}
            queryKey={['schematics', 'upload']}
            getFunc={getSchematicUploads}
            container={() => container}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
            itemMinWidth={320}
            itemMinHeight={352}
            contentOffsetHeight={112}
            gap={8}
          >
            {(data) => (
              <UploadSchematicPreviewCard key={data.id} schematic={data} />
            )}
          </ResponsiveInfiniteScrollGrid>
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
          {(data) => (
            <UploadSchematicPreviewCard key={data.id} schematic={data} />
          )}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-4 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={data ?? 0} />
        </GridLayout>
      </div>
    </div>
  );
}

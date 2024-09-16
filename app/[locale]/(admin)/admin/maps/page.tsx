'use client';

import React, { useState } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { getMapUploadCount, getMapUploads } from '@/query/map';
import GridPaginationList from '@/components/common/grid-pagination-list';
import {
  PaginationLayoutSwitcher,
  ListLayout,
  GridLayout,
} from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import useClientQuery from '@/hooks/use-client-query';
import { omit } from 'lodash';
import Tran from '@/components/common/tran';

export default function Page() {
  const { map } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['maps', 'total', 'upload', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getMapUploadCount(axios, params),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={map} />
      <div className="flex justify-between">
        <Tran text="found" args={{ number: data }} />
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div
          className="relative flex h-full flex-col overflow-auto"
          ref={(ref) => setContainer(ref)}
        >
          <ResponsiveInfiniteScrollGrid
            params={params}
            queryKey={['maps', 'upload']}
            getFunc={getMapUploads}
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
            {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
          </ResponsiveInfiniteScrollGrid>
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
          {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-4 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={data} />
        </GridLayout>
      </div>
    </div>
  );
}

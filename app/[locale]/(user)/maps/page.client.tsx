'use client';

import React from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import { UploadIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import InternalLink from '@/components/common/internal-link';
import { GridLayout, ListLayout, PaginationLayoutSwitcher } from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import MapPreviewCard from '@/components/map/map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import env from '@/constant/env';
import { getMapCount, getMaps } from '@/query/map';
import { ItemPaginationQuery, ItemPaginationQueryType } from '@/query/search-query';
import { Map } from '@/types/response/Map';

type Props = {
  maps: Map[];
  params: ItemPaginationQueryType;
};

export default function Client({ maps, params }: Props) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="map" />
      <div className="flex justify-end">
        <PaginationLayoutSwitcher />
      </div>
      <ScrollContainer>
        <ListLayout>
          <InfinitePage
            paramSchema={ItemPaginationQuery}
            queryKey={['maps']}
            queryFn={getMaps}
            initialData={maps}
            initialParams={params}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <MapPreviewCard key={data.id} map={data} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            paramSchema={ItemPaginationQuery}
            queryKey={['maps']}
            queryFn={getMaps}
            initialData={maps}
            initialParams={params}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data) => <MapPreviewCard key={data.id} map={data} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={`${env.url.base}/upload/map`}>
          <UploadIcon className="size-5" />
          <Tran text="map.upload" />
        </InternalLink>
        <GridLayout>
          <PaginationNavigator numberOfItems={getMapCount} queryKey={['maps', 'total']} />
        </GridLayout>
      </div>
    </div>
  );
}

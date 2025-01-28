'use client';

import React, { useRef } from 'react';

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
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { omit } from '@/lib/utils';
import { getMapCount, getMaps } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';
import { Map } from '@/types/response/Map';

type Props = {
  maps: Map[];
};

export default function Client({ maps }: Props) {
  const params = useSearchQuery(ItemPaginationQuery);

  const container = useRef<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['maps', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getMapCount(axios, params),
    placeholderData: 0,
  });

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <NameTagSearch type="map" />
      <div className="flex justify-end">
        <PaginationLayoutSwitcher />
      </div>
      <ScrollContainer ref={container}>
        <ListLayout>
          <InfinitePage
            params={params}
            queryKey={['maps']}
            queryFn={getMaps}
            initialData={maps}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data, index) => <MapPreviewCard key={data.id} map={data} imageCount={index} />}
          </InfinitePage>
        </ListLayout>
        <GridLayout>
          <GridPaginationList
            params={params}
            queryKey={['maps']}
            queryFn={getMaps}
            initialData={maps}
            skeleton={{
              amount: 20,
              item: <PreviewSkeleton />,
            }}
          >
            {(data, index) => <MapPreviewCard key={data.id} map={data} imageCount={index} />}
          </GridPaginationList>
        </GridLayout>
      </ScrollContainer>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <InternalLink variant="button-secondary" href={`${env.url.base}/upload/map`}>
          <UploadIcon className="size-5" />
          <Tran text="map.upload" />
        </InternalLink>
        <GridLayout>
          <PaginationNavigator numberOfItems={data} />
        </GridLayout>
      </div>
    </div>
  );
}

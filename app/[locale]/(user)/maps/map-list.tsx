'use client';

import { omit } from 'lodash';
import { UploadIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InternalLink from '@/components/common/internal-link';
import {
  GridLayout,
  ListLayout,
  PaginationLayoutSwitcher,
} from '@/components/common/pagination-layout';
import PaginationNavigator from '@/components/common/pagination-navigator';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import MapPreviewCard from '@/components/map/map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import env from '@/constant/env';
import useClientQuery from '@/hooks/use-client-query';
import useSearchQuery from '@/hooks/use-search-query';
import { useSearchTags } from '@/hooks/use-tags';
import { getMapCount, getMaps } from '@/query/map';
import { ItemPaginationQuery } from '@/query/query';

export default function MapList() {
  const { map } = useSearchTags();
  const params = useSearchQuery(ItemPaginationQuery);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { data } = useClientQuery({
    queryKey: ['maps', 'total', omit(params, 'page', 'size', 'sort')],
    queryFn: (axios) => getMapCount(axios, params),
  });

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={map} />
      <div className="flex justify-between">
        <span>Found {data} maps</span>
        <PaginationLayoutSwitcher />
      </div>
      <ListLayout>
        <div
          className="relative flex h-full flex-col overflow-auto"
          ref={(ref) => setContainer(ref)}
        >
          <ResponsiveInfiniteScrollGrid
            params={params}
            queryKey={['maps']}
            getFunc={getMaps}
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
            {(data) => <MapPreviewCard key={data.id} map={data} />}
          </ResponsiveInfiniteScrollGrid>
        </div>
      </ListLayout>
      <GridLayout>
        <GridPaginationList
          params={params}
          queryKey={['maps']}
          getFunc={getMaps}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <MapPreviewCard key={data.id} map={data} />}
        </GridPaginationList>
      </GridLayout>
      <div className="flex flex-wrap items-center justify-end gap-4 sm:flex-row-reverse sm:justify-between">
        <GridLayout>
          <PaginationNavigator numberOfItems={data ?? 0} />
        </GridLayout>
        <div className="flex gap-1">
          <InternalLink
            variant="button-secondary"
            href={`${env.url.base}/users/me`}
            title="My map"
          >
            <UserIcon className="size-5" />
            My map
          </InternalLink>
          <InternalLink
            variant="button-secondary"
            href={`${env.url.base}/upload/map`}
            title="My map"
          >
            <UploadIcon className="size-5" />
            Upload map
          </InternalLink>
        </div>
      </div>
    </div>
  );
}

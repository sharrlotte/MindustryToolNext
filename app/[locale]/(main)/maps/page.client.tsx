'use client';

import React from 'react';

import GridPaginationList from '@/components/common/grid-pagination-list';
import InfinitePage from '@/components/common/infinite-page';
import { GridLayout, ListLayout } from '@/components/common/pagination-layout';
import ScrollContainer from '@/components/common/scroll-container';
import MapPreviewCard from '@/components/map/map-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

import { getMaps } from '@/query/map';
import { ItemPaginationQuery } from '@/query/search-query';

export default function Client() {
  return (
    <ScrollContainer>
      <ListLayout>
        <InfinitePage
          paramSchema={ItemPaginationQuery}
          queryKey={['maps']}
          queryFn={getMaps}
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
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
        >
          {(data) => <MapPreviewCard key={data.id} map={data} />}
        </GridPaginationList>
      </GridLayout>
    </ScrollContainer>
  );
}

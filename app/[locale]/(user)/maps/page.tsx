'use client';

import InfinitePage from '@/components/common/infinite-page';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import MapPreviewCard from '@/components/map/map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getMaps from '@/query/map/get-maps';

import { useRef } from 'react';

export default function MapPage() {
  const { map } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={map} />
      <div
        className="relative flex h-full flex-col overflow-auto "
        ref={container}
      >
        <ResponsiveInfiniteScrollGrid
          params={params}
          queryKey={['maps']}
          getFunc={getMaps}
          container={() => container.current}
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
    </div>
  );
}

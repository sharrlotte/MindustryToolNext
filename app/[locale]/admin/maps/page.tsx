'use client';

import InfinitePage from '@/components/common/infinite-page';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getMapUploads from '@/query/map/get-map-uploads';
import React, { useRef } from 'react';

export default function Page() {
  const { map } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-4 p-4">
      <NameTagSearch tags={map} />
      <div
        className="relative flex h-full flex-col gap-4 overflow-y-auto"
        ref={container}
      >
        <ResponsiveInfiniteScrollGrid
          queryKey={['map-uploads']}
          getFunc={getMapUploads}
          params={params}
          container={() => container.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
          itemMinWidth={224}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}

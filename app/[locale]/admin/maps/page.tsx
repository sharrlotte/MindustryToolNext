'use client';

import React, { useState } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import UploadMapPreviewCard from '@/components/map/upload-map-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getMapUploads from '@/query/map/get-map-uploads';

export default function Page() {
  const { map } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-4 p-4">
      <NameTagSearch tags={map} />
      <div
        className="relative flex h-full flex-col gap-4 overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <ResponsiveInfiniteScrollGrid
          queryKey={['map-uploads']}
          getFunc={getMapUploads}
          params={params}
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
    </div>
  );
}

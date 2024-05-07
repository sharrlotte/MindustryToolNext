'use client';

import InfinitePage from '@/components/common/infinite-page';
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
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={map} />
      <InfinitePage
        queryKey={['map-uploads']}
        getFunc={getMapUploads}
        params={params}
        scrollContainer={scrollContainer.current}
        skeleton={{
          amount: 20,
          item: <PreviewSkeleton />,
        }}
      >
        {(data) => <UploadMapPreviewCard key={data.id} map={data} />}
      </InfinitePage>
    </div>
  );
}

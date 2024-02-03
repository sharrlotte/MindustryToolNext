'use client';

import InfinitePage from '@/components/common/infinite-page';
import UploadMapPreview from '@/components/map/upload-map-preview';
import NameTagSearch from '@/components/search/name-tag-search';
import useTags from '@/hooks/use-tags';
import getMapUploads from '@/query/map/get-map-upload';
import React, { useRef } from 'react';

export default function Page() {
  const { map } = useTags();
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
        scrollContainer={scrollContainer.current}
      >
        {(data) => <UploadMapPreview key={data.id} map={data} />}
      </InfinitePage>
    </div>
  );
}

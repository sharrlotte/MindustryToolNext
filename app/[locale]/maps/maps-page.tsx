'use client';

import MapPreview from '@/components/map/map-preview';
import getMaps from '@/query/map/get-maps';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';

export default function MapPage() {
  const data = useTags();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex h-full w-full flex-col gap-2 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={data.map} />
      <InfinitePage
        queryKey={['maps']}
        getFunc={getMaps}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <MapPreview key={data.id} map={data} />}
      </InfinitePage>
    </div>
  );
}

'use client';

import getMaps from '@/query/map/get-maps';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';
import useSearchPageParams from '@/hooks/use-search-page-params';
import MapPreviewCard from '@/components/map/map-preview-card';

export default function MapPage() {
  const { map } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={map} />
      <InfinitePage
        params={params}
        queryKey={['maps']}
        getFunc={getMaps}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <MapPreviewCard key={data.id} map={data} />}
      </InfinitePage>
    </div>
  );
}

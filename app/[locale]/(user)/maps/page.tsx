'use client';

import getMaps from '@/query/map/get-maps';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import { useRef } from 'react';
import useSearchPageParams from '@/hooks/use-search-page-params';
import MapPreviewCard from '@/components/map/map-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { useSearchTags } from '@/hooks/use-tags';

export default function MapPage() {
  const { map } = useSearchTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4"
      ref={(ref) => {
        scrollContainer.current = ref;
      }}
    >
      <NameTagSearch tags={map} />
      <InfinitePage
        params={params}
        queryKey={['maps']}
        getFunc={getMaps}
        scrollContainer={scrollContainer.current}
        skeleton={{
          amount: 20,
          item: <PreviewSkeleton />,
        }}
      >
        {(data) => <MapPreviewCard key={data.id} map={data} />}
      </InfinitePage>
    </div>
  );
}

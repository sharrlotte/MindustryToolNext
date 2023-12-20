'use client';

import MapPreview from '@/components/map/map-preview';
import getMaps from '@/query/map/get-maps';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';

export default function MapPage() {
  const { data } = useTags();

  return (
    <div className="flex flex-col gap-4">
      <NameTagSearch tags={data?.map} />
      <InfinitePage queryKey={['maps']} getFunc={getMaps}>
        {(data) => <MapPreview map={data} />}
      </InfinitePage>
    </div>
  );
}

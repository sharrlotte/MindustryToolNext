'use client';

import getSchematics from '@/query/schematic/get-schematics';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';
import useSearchPageParams from '@/hooks/use-search-page-params';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';

export default function Page() {
  const { schematic } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={schematic} />
      <InfinitePage
        params={params}
        queryKey={['schematics']}
        getFunc={getSchematics}
        scrollContainer={scrollContainer.current}
        skeleton={{
          amount: 20,
          item: <PreviewSkeleton />,
        }}
      >
        {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
      </InfinitePage>
    </div>
  );
}

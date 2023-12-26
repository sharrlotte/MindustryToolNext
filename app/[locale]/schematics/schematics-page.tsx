'use client';

import SchematicPreview from '@/components/schematic/schematic-preview';
import getSchematics from '@/query/schematic/get-schematics';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';
import { useRef } from 'react';

export default function SchematicsPage() {
  const { data } = useTags();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="flex h-full flex-col gap-2 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={data?.schematic} />
      <InfinitePage
        queryKey={['schematics']}
        getFunc={getSchematics}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <SchematicPreview key={data.id} schematic={data} />}
      </InfinitePage>
    </div>
  );
}

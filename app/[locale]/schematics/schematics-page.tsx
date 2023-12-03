'use client';

import SchematicPreview from '@/components/schematic/schematic-preview';
import getSchematics from '@/query/schematic/get-schematics';
import NameTagSearch from '@/components/search/name-tag-search';
import InfinitePage from '@/components/common/infinite-page';
import useTags from '@/hooks/use-tags';

export default function SchematicsPage() {
  const { data } = useTags();
  
  return (
    <div className="flex flex-col gap-4">
      <NameTagSearch tags={data?.schematic} />
      <InfinitePage queryKey={['schematics']} getFunc={getSchematics}>
        {(data) => <SchematicPreview schematic={data} />}
      </InfinitePage>
    </div>
  );
}

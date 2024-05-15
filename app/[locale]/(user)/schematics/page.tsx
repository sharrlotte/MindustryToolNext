'use client';

import getSchematics from '@/query/schematic/get-schematics';
import NameTagSearch from '@/components/search/name-tag-search';
import { useRef } from 'react';
import useSearchPageParams from '@/hooks/use-search-page-params';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { useSearchTags } from '@/hooks/use-tags';
import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';

export default function Page() {
  const { schematic } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
      <div
        className="relative flex h-full flex-col overflow-auto"
        ref={(ref) => {
          container.current = ref;
        }}
      >
        <ResponsiveInfiniteScrollGrid
          params={params}
          queryKey={['schematics']}
          getFunc={getSchematics}
          container={container.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
          itemMinWidth={224}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}

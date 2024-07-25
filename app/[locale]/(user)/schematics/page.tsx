'use client';

import { PlusIcon } from 'lucide-react';
import { useRef } from 'react';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Button } from '@/components/ui/button';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getSchematics from '@/query/schematic/get-schematics';

export default function Page() {
  const { schematic } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <NameTagSearch tags={schematic} />
      <div
        className="relative flex h-full flex-col overflow-auto"
        ref={container}
      >
        <ResponsiveInfiniteScrollGrid
          params={params}
          queryKey={['schematics']}
          getFunc={getSchematics}
          container={() => container.current}
          skeleton={{
            amount: 20,
            item: <PreviewSkeleton />,
          }}
          itemMinWidth={320}
          itemMinHeight={352}
          contentOffsetHeight={112}
          gap={8}
        >
          {(data) => <SchematicPreviewCard key={data.id} schematic={data} />}
        </ResponsiveInfiniteScrollGrid>
      </div>
      <div className="justify-end items-center flex">
        <Button title="Add" className="items-center flex gap-2 pl-1 pr-3">
          <PlusIcon />
          Add your schematic
        </Button>
      </div>
    </div>
  );
}

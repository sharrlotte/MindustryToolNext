'use client';

import ResponsiveInfiniteScrollGrid from '@/components/common/responsive-infinite-scroll-grid';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import getSchematicUploads from '@/query/schematic/get-schematic-uploads';
import React, { useRef } from 'react';

export default function Page() {
  const { schematic } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative flex h-full flex-col gap-4 p-4">
      <NameTagSearch tags={schematic} />
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={container}
      >
        <ResponsiveInfiniteScrollGrid
          params={params}
          queryKey={['schematic-uploads']}
          getFunc={getSchematicUploads}
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
          {(data) => (
            <UploadSchematicPreviewCard key={data.id} schematic={data} />
          )}
        </ResponsiveInfiniteScrollGrid>
      </div>
    </div>
  );
}

'use client';

import InfinitePage from '@/components/common/infinite-page';
import UploadSchematicPreviewCard from '@/components/schematic/upload-schematic-preview-card';
import NameTagSearch from '@/components/search/name-tag-search';
import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import useSearchPageParams from '@/hooks/use-search-page-params';
import useTags from '@/hooks/use-tags';
import getSchematicUploads from '@/query/schematic/get-schematic-uploads';
import React, { useRef } from 'react';

export default function Page() {
  const { schematic } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={schematic} />
      <InfinitePage
        params={params}
        queryKey={['schematic-uploads']}
        getFunc={getSchematicUploads}
        scrollContainer={scrollContainer.current}
        skeleton={{
          amount: 20,
          item: <PreviewSkeleton />,
        }}
      >
        {(data) => (
          <UploadSchematicPreviewCard key={data.id} schematic={data} />
        )}
      </InfinitePage>
    </div>
  );
}

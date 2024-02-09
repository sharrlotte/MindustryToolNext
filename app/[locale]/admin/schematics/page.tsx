'use client';

import InfinitePage from '@/components/common/infinite-page';
import UploadSchematicPreview from '@/components/schematic/upload-schematic-preview';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import useTags from '@/hooks/use-tags';
import getSchematicUploads from '@/query/schematic/get-schematic-upload';
import React, { useRef } from 'react';

export default function Page() {
  const { schematic } = useTags();
  const params = useSearchPageParams();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-4 overflow-y-auto pr-2"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={schematic} />
      <InfinitePage
        params={params}
        queryKey={['schematic-uploads']}
        getFunc={getSchematicUploads}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <UploadSchematicPreview key={data.id} schematic={data} />}
      </InfinitePage>
    </div>
  );
}

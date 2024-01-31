'use client';

import InfinitePage from '@/components/common/infinite-page';
import UploadSchematicPreview from '@/components/schematic/upload-schematic-preview';
import NameTagSearch from '@/components/search/name-tag-search';
import useTags from '@/hooks/use-tags';
import getSchematicUploads from '@/query/schematic/get-schematic-upload';
import React, { useRef } from 'react';

export default function Page() {
  const { schematic } = useTags();
  const scrollContainer = useRef<HTMLDivElement | null>();

  return (
    <div
      className="relative flex h-full flex-col gap-2 overflow-y-auto p-4"
      ref={(ref) => (scrollContainer.current = ref)}
    >
      <NameTagSearch tags={schematic} />
      <InfinitePage
        queryKey={['schematic-upload']}
        getFunc={getSchematicUploads}
        scrollContainer={scrollContainer.current}
      >
        {(data) => <UploadSchematicPreview key={data.id} schematic={data} />}
      </InfinitePage>
    </div>
  );
}

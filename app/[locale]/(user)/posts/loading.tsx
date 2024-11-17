import React from 'react';

import PreviewContainerSkeleton from '@/components/common/preview-container-skeleton';
import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';
import NameTagSearchSkeleton from '@/components/search/name-tag-search-skeleton';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <NameTagSearchSkeleton />
      <PreviewContainerSkeleton>
        {new Array(20).fill(1).map((_, index) => (
          <PluginCardSkeleton key={index} />
        ))}
      </PreviewContainerSkeleton>
    </div>
  );
}

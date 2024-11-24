import React from 'react';

import PreviewContainerSkeleton from '@/components/common/preview-container-skeleton';
import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';
import NameTagSearchSkeleton from '@/components/search/name-tag-search-skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <NameTagSearchSkeleton />
      <PreviewContainerSkeleton>
        <Skeletons number={20}>
          <PluginCardSkeleton />
        </Skeletons>
      </PreviewContainerSkeleton>
    </div>
  );
}

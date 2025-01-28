import React from 'react';

import PluginCardSkeleton from '@/components/plugin/plugin-card-skeleton';
import NameTagSearchSkeleton from '@/components/search/name-tag-search-skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2">
      <NameTagSearchSkeleton />
      <div className="relative flex h-full flex-col gap-2">
        <Skeletons number={20}>
          <PluginCardSkeleton />
        </Skeletons>
      </div>
    </div>
  );
}

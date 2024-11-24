import React from 'react';

import ScrollContainer from '@/components/common/scroll-container';
import InternalServerCardSkeleton from '@/components/server/internal-server-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      <Skeleton className="h-12 w-full" />
      <ScrollContainer className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
        <Skeletons number={20}>
          <InternalServerCardSkeleton />
        </Skeletons>
      </ScrollContainer>
    </div>
  );
}

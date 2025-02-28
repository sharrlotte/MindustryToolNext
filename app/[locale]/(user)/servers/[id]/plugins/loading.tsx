import React from 'react';

import ScrollContainer from '@/components/common/scroll-container';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden">
      <Skeleton className="h-14 w-full rounded-md" />
      <ScrollContainer className="grid h-full w-full gap-2 md:grid-cols-2 lg:grid-cols-3">
        <Skeletons number={20}>
          <Skeleton className="h-32 w-full" />
        </Skeletons>
      </ScrollContainer>
    </div>
  );
}

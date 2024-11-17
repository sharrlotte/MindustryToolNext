import React from 'react';

import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <div className="flex gap-2">
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="grid h-full w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2 overflow-y-auto pr-1">
        {Array(20)
          .fill(1)
          .map((_, index) => (
            <PreviewSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

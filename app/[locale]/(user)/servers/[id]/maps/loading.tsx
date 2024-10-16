import PreviewSkeleton from '@/components/skeleton/preview-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex gap-2">
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2 pr-1">
        {Array(20)
          .fill(1)
          .map((_, index) => (
            <PreviewSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

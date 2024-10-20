import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
      <Skeleton className="h-14 w-full" />
      <div className="grid h-full w-full gap-2 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
        {Array(20)
          .fill(1)
          .map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
      </div>
    </div>
  );
}

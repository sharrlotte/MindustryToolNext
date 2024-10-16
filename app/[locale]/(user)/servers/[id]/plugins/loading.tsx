import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <Skeleton className="h-14 w-full" />
      <div className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Array(20)
          .fill(1)
          .map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
      </div>
    </div>
  );
}

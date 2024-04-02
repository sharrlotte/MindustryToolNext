import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function PreviewSkeleton() {
  return (
    <div className="flex h-full min-h-[18rem] animate-appear flex-col items-center justify-between gap-2 overflow-hidden rounded-md border bg-card shadow-md">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="flex flex-col items-center justify-center p-1">
        <Skeleton className="w-10" />
        <div className="grid w-full grid-flow-col justify-center gap-2 [grid-auto-columns:minmax(0,1fr)]">
          <Skeleton className="h-9 w-9"></Skeleton>
          <Skeleton className="h-9 w-9"></Skeleton>
          <Skeleton className="h-9 w-9"></Skeleton>
          <Skeleton className="h-9 w-9"></Skeleton>
          <Skeleton className="h-9 w-9"></Skeleton>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-2 md:pl-2">
      <Skeleton className="h-full w-full flex-[4]" />
      <Skeleton className="h-full w-full flex-1" />
      <Skeleton className="h-full w-full flex-[2]" />
    </div>
  );
}

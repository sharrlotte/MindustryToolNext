import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-full w-full flex-[4]" />
      <Skeleton className="h-full w-full flex-1" />
      <Skeleton className="h-full w-full flex-[2]" />
    </div>
  );
}

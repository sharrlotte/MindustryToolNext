import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-full w-full rounded-none" />
      <Skeleton className="h-20 w-full rounded-none" />
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function NameTagSearchSkeleton() {
  return (
    <div className="flex justify-center gap-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="size-10" />
    </div>
  );
}

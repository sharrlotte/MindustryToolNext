import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function NameTagSearchSkeleton() {
  return (
    <div className="flex justify-center gap-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-[52px]" />
    </div>
  );
}

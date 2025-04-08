import React from 'react';

import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function DetailSkeleton() {
  return (
    <div className="absolute h-full w-full bg-background p-2 backdrop-blur-xs">
      <div className="relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden lg:items-stretch">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative overflow-hidden rounded-lg">
            <Skeleton className="object-cover w-full md:w-[min(40vw,80vh)] aspect-square rounded-lg" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-80 text-xl capitalize" />
            <UserCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

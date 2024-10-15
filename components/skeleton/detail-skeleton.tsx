import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

import React from 'react';

export default function DetailSkeleton() {
  return (
    <div className="absolute h-full w-full bg-background p-2 backdrop-blur-sm">
      <div className="relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden lg:items-stretch">
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative overflow-hidden rounded-lg">
            <Skeleton className="h-[400px] max-h-full w-[400px] max-w-full" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-80 text-xl capitalize" />
            <UserCardSkeleton />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
            <Skeleton className="border border-border" />
            <Skeleton className="border border-border" />
            <Skeleton className="border border-border" />
            <Skeleton className="border border-border" />
          </div>
          <Skeleton className="h-9 w-16 border border-border" />
        </div>
      </div>
    </div>
  );
}

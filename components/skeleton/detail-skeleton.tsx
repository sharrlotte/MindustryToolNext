import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

type DetailSkeletonProps = {
  padding?: boolean;
};

export default function DetailSkeleton({ padding }: DetailSkeletonProps) {
  return (
    <div
      className={cn('absolute h-full w-full bg-background backdrop-blur-sm', {
        'p-2': padding,
      })}
    >
      <div className="relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden lg:items-stretch">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="relative">
            <Skeleton className="h-[400px] max-h-full w-[400px] max-w-full overflow-hidden rounded-lg" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-80 text-xl capitalize" />
            <UserCardSkeleton />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-9 border border-border" />
          <Skeleton className="h-9 w-9 border border-border" />
          <Skeleton className="h-9 w-9 border border-border" />
          <Skeleton className="h-9 w-9 border border-border" />
        </div>
      </div>
    </div>
  );
}

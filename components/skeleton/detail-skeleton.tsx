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
        'p-4': padding,
      })}
    >
      <div className="relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden lg:items-stretch">
        <div className="flex flex-row flex-wrap gap-2">
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

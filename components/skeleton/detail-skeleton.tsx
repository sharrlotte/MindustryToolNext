import UserCardSkeleton from '@/components/skeleton/user-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function DetailSkeleton() {
  return (
    <div className="absolute h-full w-full bg-background backdrop-blur-sm">
      <div className="relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden p-4 lg:items-stretch">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="relative">
            <Skeleton className="min-h-80 min-w-80 overflow-hidden rounded-lg" />
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

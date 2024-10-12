import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function PluginCardSkeleton() {
  return (
    <div className="relative flex h-28 flex-col gap-2 rounded-md bg-card p-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

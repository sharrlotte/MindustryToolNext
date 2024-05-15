import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function PreviewSkeleton() {
  return (
    <div className="flex h-full min-h-[23rem] animate-appear flex-col items-center justify-between gap-2 overflow-hidden rounded-md border bg-card shadow-md">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="flex h-28 flex-col items-center justify-center p-1" />
    </div>
  );
}

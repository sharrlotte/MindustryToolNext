import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function PreviewSkeleton() {
  return (
    <div className="flex border min-h-preview-height min-w-[min(100vw,var(--preview-size))] max-w-[calc(var(--preview-size)*2)] flex-col rounded-md overflow-hidden bg-card backdrop-filter backdrop-blur-sm shadow-md">
      <Skeleton className="h-full aspect-square w-full rounded-none" />
      <div className="flex h-28 flex-col items-center justify-center" />
    </div>
  );
}

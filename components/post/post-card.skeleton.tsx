import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function PostCardSkeleton() {
  return <Skeleton className="relative flex h-[212px] w-full flex-col gap-2 rounded-md bg-card border" />;
}

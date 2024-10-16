import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function PluginCardSkeleton() {
  return <Skeleton className="relative flex h-28 w-full flex-col gap-2 rounded-md bg-card" />;
}

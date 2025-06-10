import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function PluginCardSkeleton() {
	return <Skeleton className="relative flex h-40 w-full flex-col gap-2 rounded-md bg-card border" />;
}

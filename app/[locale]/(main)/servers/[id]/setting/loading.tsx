import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="flex w-full flex-col h-full gap-2 p-2">
			<Skeleton className="h-full w-full rounded-none" />
			<Skeleton className="h-20 w-full rounded-none" />
		</div>
	);
}

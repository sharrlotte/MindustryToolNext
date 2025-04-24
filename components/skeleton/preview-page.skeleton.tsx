import React from 'react';

import PreviewSkeleton from '@/components/skeleton/preview.skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function PreviewPageSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<Skeleton className="h-9 w-full border rounded-md" />
				<Skeleton className="h-9 w-9 border rounded-md" />
			</div>
			{Array(20)
				.fill(1)
				.map((_, index) => (
					<PreviewSkeleton key={index} />
				))}
		</div>
	);
}

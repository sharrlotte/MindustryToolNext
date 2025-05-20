import React from 'react';

import UserCardSkeleton from '@/components/skeleton/user-card.skeleton';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DetailSkeleton() {
	return (
		<div className="absolute h-full w-full bg-background p-2 backdrop-blur-sm">
			<div className="relative h-full flex flex-col lg:grid lg:grid-cols-[1fr_400px] lg:divide-x overflow-auto">
				<div className="p-2 h-full overflow-auto flex justify-center max-h-[50vh] lg:max-h-full">
					<Skeleton className="object-cover w-full aspect-square rounded-lg" />
				</div>
				<div className="flex flex-col gap-2 p-2 h-full">
					<Skeleton className="h-12 w-full rounded-md" />
					<Divider />
					<UserCardSkeleton />
					<Skeleton className="h-8 w-[80%] rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<Skeleton className="h-8 w-[70%] rounded-md" />
					<Skeleton className="h-8 w-full rounded-md" />
					<div className="grid gap-2 mt-auto grid-cols-4 border-t pt-2">
						<Skeleton className="h-8 w-full rounded-md" />
						<Skeleton className="h-8 w-full rounded-md" />
						<Skeleton className="h-8 w-full rounded-md" />
						<Skeleton className="h-8 w-full rounded-md" />
					</div>
				</div>
			</div>
		</div>
	);
}

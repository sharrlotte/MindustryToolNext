import React from 'react';

import UserCardSkeleton from '@/components/skeleton/user-card.skeleton';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DetailSkeleton() {
	return (
		<div className="absolute p-2 w-full h-full backdrop-blur-sm bg-background">
			<div className="relative h-full flex flex-col lg:grid lg:grid-cols-[1fr_500px] lg:divide-x overflow-auto">
				<div className="p-2 h-full overflow-auto flex justify-center max-h-[50vh] lg:max-h-full">
					<Skeleton className="object-cover w-full rounded-lg aspect-square" />
				</div>
				<div className="flex flex-col gap-2 p-2 h-full">
					<Skeleton className="w-full h-12 rounded-md" />
					<Divider />
					<UserCardSkeleton />
					<Skeleton className="h-8 w-[80%] rounded-md" />
					<Skeleton className="w-full h-8 rounded-md" />
					<Skeleton className="h-8 w-[70%] rounded-md" />
					<Skeleton className="w-full h-8 rounded-md" />
					<div className="grid grid-cols-4 gap-2 pt-2 mt-auto border-t">
						<Skeleton className="w-full h-8 rounded-md" />
						<Skeleton className="w-full h-8 rounded-md" />
						<Skeleton className="w-full h-8 rounded-md" />
						<Skeleton className="w-full h-8 rounded-md" />
					</div>
				</div>
			</div>
		</div>
	);
}

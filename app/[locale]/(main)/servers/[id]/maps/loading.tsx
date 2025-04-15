import React from 'react';

import ScrollContainer from '@/components/common/scroll-container';
import PreviewSkeleton from '@/components/skeleton/preview.skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function Loading() {
	return (
		<div className="flex h-full w-full flex-col gap-2 overflow-hidden">
			<ScrollContainer className="grid h-full w-full grid-cols-[repeat(auto-fit,minmax(min(var(--preview-size),100%),1fr))] justify-center gap-2">
				<Skeletons number={20}>
					<PreviewSkeleton />
				</Skeletons>
			</ScrollContainer>
			<div className="flex gap-2 mt-auto">
				<Skeleton className="h-14 w-full rounded-md" />
			</div>
		</div>
	);
}

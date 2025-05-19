import { Skeleton } from '@/components/ui/skeleton';

export default function UserCardSkeleton({ avatar }: { avatar?: boolean }) {
	return (
		<div className="flex min-h-5 w-56 items-end justify-start gap-2">
			{avatar && <Skeleton className="block h-8 w-8 rounded-full border border-border" />}
			<Skeleton className="h-5 w-full flex-1 rounded-md" />
		</div>
	);
}

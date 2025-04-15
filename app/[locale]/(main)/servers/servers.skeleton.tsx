import ServerCardSkeleton from '@/components/server/server-card.skeleton';
import Skeletons from '@/components/ui/skeletons';

export default function ServersSkeleton() {
	return (
		<Skeletons number={20}>
			<ServerCardSkeleton />
		</Skeletons>
	);
}

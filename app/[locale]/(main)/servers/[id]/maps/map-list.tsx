'use client';

import ErrorMessage from '@/components/common/error-message';
import ScrollContainer from '@/components/common/scroll-container';
import ServerMapCard from '@/components/server/server-map-card';
import PreviewSkeleton from '@/components/skeleton/preview.skeleton';
import Skeletons from '@/components/ui/skeletons';

import useServerMaps from '@/hooks/use-server-maps';

export default function MapList({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useServerMaps(id);

	if (isError) {
		return <ErrorMessage className="col-span-full" error={error} />;
	}

	return (
		<ScrollContainer className="grid w-full h-fit grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-start gap-2">
			{isLoading ? (
				<Skeletons number={20}>
					<PreviewSkeleton />
				</Skeletons>
			) : (
				data?.map((map) => <ServerMapCard serverId={id} key={map.filename} map={map} />)
			)}
		</ScrollContainer>
	);
}

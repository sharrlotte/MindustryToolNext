import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import ServerMapCard from '@/components/server/server-map-card';

import useServerMaps from '@/hooks/use-server-maps';

export default function MapList({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useServerMaps(id);

	if (isLoading) {
		return <LoadingSpinner className="col-span-full" />;
	}

	if (isError) {
		return <ErrorMessage className="col-span-full" error={error} />;
	}

	return (
		<ScrollContainer className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(var(--preview-size),100%),1fr))] justify-start gap-2">
			{data?.map((map) => <ServerMapCard serverId={id} key={map.filename} map={map} />)}
		</ScrollContainer>
	);
}

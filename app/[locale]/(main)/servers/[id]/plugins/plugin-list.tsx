import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import ServerPluginCard from '@/components/server/server-plugin-card';

import useServerPlugins from '@/hooks/use-server-plugins';

export default function PluginList({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useServerPlugins(id);

	if (isLoading) {
		return <LoadingSpinner className="col-span-full" />;
	}

	if (isError) {
		return <ErrorMessage className="col-span-full" error={error} />;
	}

	return (
		<ScrollContainer className="w-full gap-2 md:grid-cols-2 lg:grid-cols-3 grid-flow-row">
			{data?.map((plugin) => <ServerPluginCard serverId={id} key={plugin.filename} plugin={plugin} />)}
		</ScrollContainer>
	);
}

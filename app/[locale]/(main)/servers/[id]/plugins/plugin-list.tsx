import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
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

	return data?.map((plugin) => <ServerPlugdowinCard serverId={id} key={plugin.filename} plugin={plugin} />);
}

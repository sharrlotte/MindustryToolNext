'use client';

import ErrorMessage from '@/components/common/error-message';
import ScrollContainer from '@/components/common/scroll-container';
import ServerPluginCard from '@/components/server/server-plugin-card';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

import useServerPlugins from '@/hooks/use-server-plugins';

export default function PluginList({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useServerPlugins(id);

	if (isError) {
		return <ErrorMessage className="col-span-full" error={error} />;
	}

	return (
		<ScrollContainer className="grid w-full gap-2 md:grid-cols-2 xl:grid-cols-3 grid-flow-row">
			{isLoading ? (
				<Skeletons number={20}>
					<Skeleton className="flex overflow-hidden relative flex-col gap-1 p-2 h-48 rounded-md border min-h-48 bg-card" />
				</Skeletons>
			) : (
				data?.map((plugin) => <ServerPluginCard serverId={id} key={plugin.filename} plugin={plugin} />)
			)}
		</ScrollContainer>
	);
}

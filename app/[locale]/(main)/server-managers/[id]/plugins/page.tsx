'use client';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerManagePlugin, getServerManagerPlugins } from '@/query/server-manager';
import { ServerManagerPlugin } from '@/types/response/ServerManagerPlugin';

import { useMutation, useQuery } from '@tanstack/react-query';

export default function Page() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server-manager', id, 'plugin'],
		queryFn: () => getServerManagerPlugins(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="h-full overflow-hidden p-2">
			<ScrollContainer className="h-full flex flex-col gap-2">
				{data
					?.sort((a, b) => a.name.localeCompare(b.name))
					.map((map) => <ServerManagerPluginCard key={map.filename} data={map} />)}
			</ScrollContainer>
		</div>
	);
}

function ServerManagerPluginCard({ data: { name, filename, servers } }: { data: ServerManagerPlugin }) {
	const axios = useClientApi();
	const id = usePathId();

	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server-manager', id, 'plugin', filename, 'delete'],
		mutationFn: () => deleteServerManagePlugin(axios, id, filename),
		onSuccess: () => {
			invalidateByKey(['server-manager', id, 'plugin']);
		},
	});

	return (
		<div className="border rounded-md p-2 space-y-1">
			<h2>
				<ColorText text={name} />
			</h2>
			<div className="space-x-1">
				<span className="text-muted-foreground">{filename}</span>
			</div>
			<div className="flex flex-col gap-1 text-xs">
				{servers.map((server) => (
					<span key={server}>{server}</span>
				))}
			</div>
			<div className="flex w-fit">
				<DeleteButton isLoading={isPending} description={'Delete this plugin: ' + filename} onClick={mutate} />
			</div>
		</div>
	);
}

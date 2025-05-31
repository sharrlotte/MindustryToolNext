'use client';

import DeleteButton from '@/components/button/delete.button';
import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerManageMap, getServerManagerMaps } from '@/query/server-manager';
import { ServerManagerMap } from '@/types/response/ServerManagerMap';

import { useMutation, useQuery } from '@tanstack/react-query';

export default function Page() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server-manager', id, 'map'],
		queryFn: () => getServerManagerMaps(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="h-full overflow-hidden p-2">
			<ScrollContainer className="h-full gap-2 flex flex-col">
				{data?.sort((a, b) => a.name.localeCompare(b.name)).map((map) => <ServerManagerMapCard key={map.filename} data={map} />)}
			</ScrollContainer>
		</div>
	);
}

function ServerManagerMapCard({ data: { name, filename, width, height, servers } }: { data: ServerManagerMap }) {
	const axios = useClientApi();
	const id = usePathId();

	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server-manager', id, 'map', filename, 'delete'],
		mutationFn: () => deleteServerManageMap(axios, id, filename),
		onSuccess: () => {
			invalidateByKey(['server-manager', id, 'map']);
		},
	});

	return (
		<div className="border rounded-md p-2 space-y-1">
			<h2>
				<ColorText text={name} />
			</h2>
			<div className="space-x-1">
				<span>
					{width}x{height}
				</span>
				<span className="text-muted-foreground">{filename}</span>
			</div>
			<div className="flex flex-col gap-1 text-xs">
				{servers.map((server) => (
					<span key={server}>{server}</span>
				))}
			</div>
			<div className="flex w-fit">
				<DeleteButton isLoading={isPending} description={'Delete this map: ' + filename} onClick={mutate} />
			</div>
		</div>
	);
}

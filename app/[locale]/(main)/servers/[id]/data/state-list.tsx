'use client';

import ErrorMessage from '@/components/common/error-message';
import JsonDisplay from '@/components/common/json-display';
import LoadingSpinner from '@/components/common/loading-spinner';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useServerStatus from '@/hooks/use-server-status';
import { getServerState } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function StateList() {
	const id = usePathId();
	const status = useServerStatus(id);
	const axios = useClientApi();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'state'],
		queryFn: () => getServerState(axios, id),
		enabled: status === 'AVAILABLE',
	});

	if (status === 'UNAVAILABLE') {
		return (
			<div className="flex items-center justify-center h-full w-full text-destructive-foreground text-xl p-2">
				Server is offline
			</div>
		);
	}

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return <JsonDisplay json={data} />;
}

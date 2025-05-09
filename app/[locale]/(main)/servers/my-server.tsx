'use client';

import ServersSkeleton from '@/app/[locale]/(main)/servers/servers.skeleton';

import ErrorMessage from '@/components/common/error-message';
import ServerCard from '@/components/server/server-card';

import useClientQuery from '@/hooks/use-client-query';
import { getMeServers } from '@/query/user';

export default function MeServer() {
	const { data, isLoading, isError, error } = useClientQuery({ queryKey: ['me-server'], queryFn: (axios) => getMeServers(axios) });

	if (isLoading) {
		return <ServersSkeleton />;
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return data?.map((server) => <ServerCard server={server} key={server.port} />);
}

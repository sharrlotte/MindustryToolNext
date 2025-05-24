import useClientApi from '@/hooks/use-client';
import useServerStatus from '@/hooks/use-server-status';
import { getServerPlugins } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useServerPlugins(id: string) {
	const axios = useClientApi();
	const status = useServerStatus(id);

	return useQuery({
		queryKey: ['server', id, 'plugin'],
		queryFn: () => getServerPlugins(axios, id),
		enabled: status === 'AVAILABLE',
		placeholderData: [],
	});
}

import useClientApi from '@/hooks/use-client';
import { getServerPlugins } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useServerPlugins(id: string) {
	const axios = useClientApi();

	return useQuery({
		queryKey: ['server', id, 'plugin'],
		queryFn: () => getServerPlugins(axios, id),
	});
}

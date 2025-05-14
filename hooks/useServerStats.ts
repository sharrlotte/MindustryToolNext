import useClientApi from '@/hooks/use-client';
import { getServerStats } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useServerStats(id: string) {
	const axios = useClientApi();

	return useQuery({
		queryKey: ['server', id, 'stats'],
		queryFn: () => getServerStats(axios, { id }),
	});
}

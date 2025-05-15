import useClientApi from '@/hooks/use-client';
import { getServerMaps } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useServerMaps(id: string) {
	const axios = useClientApi();

	return useQuery({
		queryKey: ['server', id, 'map'],
		queryFn: () => getServerMaps(axios, id),
	});
}

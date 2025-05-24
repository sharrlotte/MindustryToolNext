import useClientApi from '@/hooks/use-client';
import { getServer } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useServer(id: string) {
	const axios = useClientApi();

	return useQuery({
		queryKey: ['server', id],
		queryFn: () => getServer(axios, { id }),
	});
}

import useClientApi from '@/hooks/use-client';
import { getMyServerManagerById } from '@/query/server-manager';

import { useQuery } from '@tanstack/react-query';

export default function useServerManager(id: string) {
	const axios = useClientApi();
	return useQuery({
		queryKey: ['server-manager', id],
		queryFn: () => getMyServerManagerById(axios, id),
	});
}

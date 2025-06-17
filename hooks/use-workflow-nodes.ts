import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import { getServerWorkflowNodes } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function useWorkflowNodes() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, ...rest } = useQuery({
		queryKey: ['server', id, 'workflow', 'node'],
		queryFn: () => getServerWorkflowNodes(axios, id),
	});

	return {
		data: data ?? [],
		...rest,
	};
}

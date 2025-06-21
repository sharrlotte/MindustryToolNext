import { useMemo } from 'react';

import { WorkflowNodeType } from '@/types/response/WorkflowContext';

import { getServerWorkflowNodes } from '@/query/server';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';

import { useQuery } from '@tanstack/react-query';

export default function useWorkflowNodeTypes() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, ...rest } = useQuery({
		queryKey: ['server', id, 'workflow', 'node'],
		queryFn: () => getServerWorkflowNodes(axios, id),
	});

	return useMemo(() => [data, rest], [data, rest]) as [Record<string, WorkflowNodeType> | undefined, typeof rest];
}

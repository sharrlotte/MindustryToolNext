import { WorkflowNodeType } from '@/types/response/WorkflowContext';

import useWorkflowNodeTypes from '@/hooks/use-workflow-nodes';

export default function useWorkflowNodeType(type: string): WorkflowNodeType | undefined {
	const [nodeTypes, { isLoading }] = useWorkflowNodeTypes();

	if (isLoading || nodeTypes === undefined) {
		return undefined;
	}

	const value = nodeTypes[type];

	if (value) {
		return value;
	}

	return {
		name: type,
		group: 'UNKNOWN',
		color: '#6ede87',
		fields: [],
		outputs: [],
		inputs: 0,
	};
}

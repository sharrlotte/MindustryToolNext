import { useCallback, useMemo } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

import { WorkflowNodeState } from '@/types/response/WorkflowContext';

export default function useWorkflowNodeState(id: string) {
	const { nodes, setNodes } = useWorkflowEditor();

	const state: WorkflowNodeState = useMemo(
		() =>
			nodes.find((node) => node.id === id)?.data.state ?? {
				fields: {},
			},
		[nodes, id],
	);

	const update = useCallback(
		(fn: (state: WorkflowNodeState) => void) => {
			setNodes(
				nodes.map((node) => {
					if (node.id === id) {
						const stateCopy = JSON.parse(JSON.stringify(node.data.state));
						fn(stateCopy);
						return { ...node, data: { ...node.data, state: stateCopy } };
					}
					return node;
				}),
			);
		},

		[id, nodes, setNodes],
	);

	return { state, update };
}

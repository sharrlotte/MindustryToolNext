import { useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';

import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';

import useWorkflowNodeTypes from '@/hooks/use-workflow-nodes';

import { useReactFlow, useViewport } from '@xyflow/react';

type Match = {
	node: WorkflowNode;
	matches: {
		label: string;
		value: string;
	}[];
};

export default function SearchPanel() {
	const { debouncedNodes } = useWorkflowEditor();
	const [filter, setFilter] = useState('');
	const [debouncedFilter] = useDebounceValue(filter.toLowerCase(), 200);
	const { setCenter } = useReactFlow();
	const { zoom } = useViewport();
	const [nodeTypes] = useWorkflowNodeTypes();

	function handleClick(node: WorkflowNode) {
		setCenter(node.position.x, node.position.y, {
			zoom,
			duration: 800,
		});
	}

	const matchedNodes: Match[] = useMemo(() => {
		if (!debouncedFilter) return [];

		return debouncedNodes.reduce<Match[]>((result, node) => {
			if (!nodeTypes) {
				return [];
			}

			const nodeData = nodeTypes[node.data.name];

			if (!nodeData) {
				return result;
			}

			const matches: Match['matches'] = [];

			if (nodeData.name.toLowerCase().includes(debouncedFilter)) {
				matches.push({ label: 'label', value: nodeData.name });
			}

			if (nodeData.group.includes(debouncedFilter)) {
				matches.push({ label: 'label', value: nodeData.group });
			}

			for (const [fieldName, fieldValue] of Object.entries(node.data.state.fields)) {
				if (fieldName.toLowerCase().includes(debouncedFilter)) {
					matches.push({ label: 'label', value: fieldName });
				}

				if (
					fieldValue.consumer &&
					typeof fieldValue.consumer === 'string' &&
					fieldValue.consumer.toLowerCase().includes(debouncedFilter)
				) {
					matches.push({ label: 'variable', value: fieldValue.consumer });
				}

				if (
					fieldValue.producer &&
					typeof fieldValue.producer === 'object' &&
					fieldValue.producer.variableName.toLowerCase().includes(debouncedFilter)
				) {
					matches.push({ label: 'variable', value: fieldValue.producer.variableName });
				}
			}

			if (matches.length > 0) {
				result.push({
					node,
					matches,
				});
			}

			return result;
		}, []);
	}, [debouncedFilter, debouncedNodes, nodeTypes]);

	return (
		<div className="space-y-2 h-full overflow-hidden">
			<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			<Divider />
			<section className="space-y-2 overflow-y-auto">
				{matchedNodes.length > 0 && <Tran text="found" args={{ count: matchedNodes.length }} />}
				{matchedNodes.map(({ node, matches }) => {
					if (!nodeTypes) {
						return null;
					}

					const nodeData = nodeTypes[node.data.name];

					if (!nodeData) {
						return null;
					}

					return (
						<div className="cursor-pointer p-2 rounded-md border bg-secondary/70" key={node.id} onClick={() => handleClick(node)}>
							<h3 className="space-x-1 p-0">
								<span
									className="font-semibold"
									style={{
										color: nodeData.color,
									}}
								>
									{nodeData.name}
								</span>
								<span className="space-x-1 text-xs">
									({Math.round(node.position.x)},{Math.round(node.position.y)})
								</span>
							</h3>
							<section className="text-sm">
								{matches.map(({ label, value }, index) => (
									<div key={index}>
										<span className="text-foreground">{label}: </span>
										{value.substring(0, value.indexOf(debouncedFilter))}
										<span className="underline bg-brand/50">{debouncedFilter}</span>
										{value.substring(value.indexOf(debouncedFilter) + debouncedFilter.length)}
									</div>
								))}
							</section>
						</div>
					);
				})}
			</section>
		</div>
	);
}

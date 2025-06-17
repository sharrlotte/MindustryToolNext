import { useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import Tran from '@/components/common/tran';
import { Input } from '@/components/ui/input';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useWorkflowNodes from '@/hooks/use-workflow-nodes';
import { groupBy } from '@/lib/utils';
import { getServerWorkflowNodes } from '@/query/server';
import { WorkflowNode } from '@/types/response/WorkflowNode';

import { useQuery } from '@tanstack/react-query';

export default function NodeListPanel() {
	const [filter, setFilter] = useState('');

	const { data, isLoading, isError, error } = useWorkflowNodes();

	const nodeGroups = useMemo(
		() =>
			groupBy(
				Object.values(data ?? []).filter(({ name }) => name.includes(filter)),
				(k) => k.group,
			),
		[data, filter],
	);

	return (
		<div className="space-y-4 flex flex-col h-full overflow-hidden">
			<div>
				<h2 className="text-base">
					<Tran text="logic.instruction-list" defaultValue="Instruction list" />
				</h2>
				<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			</div>
			<section className="h-full overflow-y-auto pr-2 space-y-2">
				{nodeGroups.map((group) => (
					<InstructionGroup key={group.key} group={group} />
				))}
			</section>
		</div>
	);
}

function InstructionGroup({ group: { key, value } }: { group: { key: string; value: WorkflowNode[] } }) {
	return (
		<div className="space-y-1">
			<h3 className="text-base capitalize">{key}</h3>
			{value.map((node) => (
				<InstructionItem key={node.name} item={node} />
			))}
		</div>
	);
}

function InstructionItem({ item: { name, color } }: { item: WorkflowNode }) {
	const ref = useRef<HTMLDivElement>(null);

	const [_, drag] = useDrag({
		type: 'instruction',
		item: () => {
			return { id: name };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(ref);

	return (
		<div className="text-white p-2 border rounded-md capitalize" style={{ backgroundColor: color }} ref={ref}>
			{name}
		</div>
	);
}

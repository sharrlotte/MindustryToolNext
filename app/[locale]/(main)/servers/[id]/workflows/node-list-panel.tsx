import { useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';

import useWorkflowNodes from '@/hooks/use-workflow-nodes';
import { groupBy } from '@/lib/utils';
import { WorkflowNodeData } from '@/types/response/WorkflowContext';

export default function NodeListPanel() {
	const [filter, setFilter] = useState('');

	return (
		<div className="space-y-4 flex flex-col h-full overflow-hidden">
			<div>
				<h2 className="text-base">
					<Tran text="logic.Workflow-list" defaultValue="Workflow list" />
				</h2>
				<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			</div>
			<section className="h-full overflow-y-auto pr-2 space-y-2">
				<WorkflowGroups filter={filter} />
			</section>
		</div>
	);
}

function WorkflowGroups({ filter }: { filter: string }) {
	const { data, isLoading, isError, error } = useWorkflowNodes();

	const nodeGroups = useMemo(
		() =>
			groupBy(
				Object.values(data ?? {}).filter(({ name }) => name.includes(filter)),
				(k) => k.group,
			),
		[data, filter],
	);

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return (
			<Skeletons number={10}>
				<Skeleton className="h-16 w-full" />
			</Skeletons>
		);
	}

	return nodeGroups.map((group) => <WorkflowGroup key={group.key} group={group} />);
}

function WorkflowGroup({ group: { key, value } }: { group: { key: string; value: WorkflowNodeData[] } }) {
	return (
		<div className="space-y-1">
			<h3 className="text-base capitalize">{key}</h3>
			{value.map((node) => (
				<WorkflowItem key={node.name} item={node} />
			))}
		</div>
	);
}

function WorkflowItem({ item: { name, color } }: { item: WorkflowNodeData }) {
	const ref = useRef<HTMLDivElement>(null);

	const [_, drag] = useDrag({
		type: 'workflow',
		item: () => {
			return { id: name };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(ref);

	return (
		<div className="text-white p-2 border rounded-md capitalize cursor-pointer select-none" style={{ backgroundColor: color }} ref={ref}>
			{name}
		</div>
	);
}

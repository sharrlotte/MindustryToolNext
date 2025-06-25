import { Suspense, memo, useMemo } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

import { CatchError } from '@/components/common/catch-error';
import { Skeleton } from '@/components/ui/skeleton';

import { WorkflowNodeData, WorkflowNodeType } from '@/types/response/WorkflowContext';

import useWorkflowNodeType from '@/hooks/use-workflow-node-type';

import { cn } from '@/lib/utils';

import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { Connection, useNodeConnections } from '@xyflow/react';

import dynamic from 'next/dynamic';

const NodeItem = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/workflows/workflow-node-item'), {
	loading: () => <Skeleton className="h-14 w-full" />,
});

export type WorkflowNode = Node<Omit<WorkflowNodeData, 'x' | 'y'>, 'workflow'>;

function WorkflowNode({ id, data: { name } }: NodeProps<WorkflowNode>) {
	const type = useWorkflowNodeType(name);

	if (!type) {
		return null;
	}

	return <WorkflowNodeComponent id={id} type={type} />;
}

function WorkflowNodeComponent({
	id,
	type,
}: React.ComponentProps<'div'> & {
	id: string;
	type: WorkflowNodeType;
}) {
	const { errors } = useWorkflowEditor();

	const { name, color, outputs, fields, group, inputs } = type;
	const hasConsumerFields = useMemo(() => fields.filter((field) => field.consumer), [fields]);

	const globalError = errors[id]?.['GLOBAL'];

	return (
		<div
			className={cn('min-w-[220px] rounded-md overflow-hidden bg-card cursor-move', {
				'border-destructive-foreground': group === 'UNKNOWN',
			})}
		>
			<CatchError>
				{Array(inputs)
					.fill(1)
					.map((_, index) => (
						<InputHandle index={index} offset={index - (inputs - 1) / 2} key={index} parentId={id} />
					))}
				{outputs.map((output, index) => (
					<OutputHandle key={index} index={index} parentId={id} offset={index - (outputs.length - 1) / 2} {...output} />
				))}
				<div
					className="w-full h-full p-2 gap-1 flex items-center"
					style={{
						backgroundColor: color,
					}}
				>
					<span>{name}</span>
					<span className="border-white bg-white/30 backdrop-brightness-90 backdrop-blur-sm rounded-full px-1.5">{group}</span>
					{globalError && <span className="text-destructive-foreground text-xs">{globalError}</span>}
				</div>
				{hasConsumerFields.length > 0 && (
					<section
						className="nodrag cursor-default p-1 grid gap-1 w-full border border-t-0 border-border overflow-hidden bg-background"
						style={{
							borderBottomLeftRadius: 'calc(var(--radius) - 2px)',
							borderBottomRightRadius: 'calc(var(--radius) - 2px)',
						}}
						onClick={(event) => event.stopPropagation()}
					>
						<Suspense>
							{hasConsumerFields.map((fields) => (
								<NodeItem variant="inline" key={fields.name} parentId={id} data={fields} />
							))}
						</Suspense>
					</section>
				)}
			</CatchError>
		</div>
	);
}

export default memo(WorkflowNode);

export function OutputHandle({
	parentId,
	name,
	offset,
	index,
}: { parentId: string; offset: number; index: number } & WorkflowNodeType['outputs'][number]) {
	const { setEdges } = useWorkflowEditor();

	const id = `${parentId}-source-handle-${index}`;

	const connections = useNodeConnections({
		handleType: 'source',
		handleId: id,
		onConnect(connections: Connection[]) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) => (edge.id === (connections[0] as unknown as any).edgeId ? { ...edge, label: name } : edge)),
			);
		},
	});

	return (
		<Handle
			className="size-3 bg-emerald-500 -right-2"
			id={id}
			type="source"
			style={{ marginTop: offset * 20 + 'px' }}
			position={Position.Right}
			isConnectable={connections.length < 1}
		/>
	);
}

export function InputHandle({ parentId, offset, index }: { parentId: string; offset: number; index: number }) {
	const id = `${parentId}-target-handle-${index}`;

	return (
		<Handle
			className="size-3 bg-blue-400 -left-2"
			id={id}
			style={{ marginTop: offset * 20 + 'px' }}
			type={'target'}
			position={Position.Left}
			isConnectable={true}
		/>
	);
}

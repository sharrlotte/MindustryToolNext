import { Suspense, memo, useMemo } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { updateOutput } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow.utils';

import { CatchError } from '@/components/common/catch-error';

import { WorkflowNodeData } from '@/types/response/WorkflowContext';

import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { Connection, useNodeConnections } from '@xyflow/react';

import dynamic from 'next/dynamic';

const NodeItem = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/workflows/workflow-node-item'));

export type WorkflowNode = Node<Omit<WorkflowNodeData, 'x' | 'y'>, 'workflow'>;

function WorkflowNodeComponent({ id, data }: NodeProps<WorkflowNode>) {
	const { name, color, outputs, fields, group, inputs } = data;

	return (
		<div className="min-w-[220px] rounded-md overflow-hidden bg-card">
			<CatchError>
				{Array(inputs)
					.fill(1)
					.map((_, index) => (
						<InputHandle index={index} offset={index - (inputs - 1) / 2} key={index} parentId={id} />
					))}
				{outputs.map((output, index) => (
					<OutputHandle key={name} index={index} parentId={id} offset={index - (outputs.length - 1) / 2} {...output} />
				))}
				<div
					className="w-full h-full p-2 gap-1 flex items-center"
					style={{
						backgroundColor: color,
					}}
				>
					<span>{name}</span>
					<span className="border-white bg-white/30 backdrop-brightness-90 backdrop-blur-sm rounded-full px-1.5">{group}</span>
				</div>
				{fields.length > 0 && (
					<section
						className="p-1 grid gap-1 w-full border border-t-0 border-border overflow-hidden bg-background"
						style={{
							borderBottomLeftRadius: 'calc(var(--radius) - 2px)',
							borderBottomRightRadius: 'calc(var(--radius) - 2px)',
						}}
						onClick={(event) => event.stopPropagation()}
					>
						<Suspense>
							{fields.map((fields) => (
								<NodeItem variant="inline" key={fields.name} parentId={id} data={fields} />
							))}
						</Suspense>
					</section>
				)}
			</CatchError>
		</div>
	);
}

export default memo(WorkflowNodeComponent);

export function OutputHandle({
	parentId,
	name,
	offset,
	index,
}: { parentId: string; offset: number; index: number } & WorkflowNodeData['outputs'][number]) {
	const { nodes, setEdges, setNode } = useWorkflowEditor();

	const id = `${parentId}-source-handle-${index}`;
	const parent = useMemo(() => nodes.find((node) => node.id === parentId), [nodes, parentId]);

	const connections = useNodeConnections({
		handleType: 'source',
		handleId: id,
		onConnect(connections: Connection[]) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) => {
					if (edge.id === (connections[0] as unknown as any).edgeId) {
						return { ...edge, label: name === 'Next' ? '' : name };
					}
					return edge;
				}),
			);

			setNode(parentId, (prev) => updateOutput(prev, name, connections[0].target));
		},
	});

	if (!parent) {
		console.warn(`Parent node with id ${parentId} not found.`);
		return null;
	}

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

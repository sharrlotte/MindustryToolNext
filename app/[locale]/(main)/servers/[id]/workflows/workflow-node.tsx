import { memo } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import NodeItem from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node-item';

import { CatchError } from '@/components/common/catch-error';

import { WorkflowNodeData } from '@/types/response/WorkflowContext';

import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { Connection, useNodeConnections } from '@xyflow/react';

export type WorkflowNode = Node<Omit<WorkflowNodeData, 'x' | 'y' | 'id'>, 'workflow'>;

function WorkflowNodeComponent({ id, data }: NodeProps<WorkflowNode>) {
	const { name, color, outputs, consumers, group, inputs } = data;

	return (
		<div className="min-w-[220px] min-h-[80px] rounded-md overflow-hidden">
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
					<span className="border-white bg-white/50 backdrop-brightness-90 backdrop-blur-sm rounded-full px-1.5">{group}</span>
				</div>
				{consumers.length > 0 && (
					<section
						className="p-1 grid gap-1 w-full border border-t-0 border-border overflow-hidden bg-background rounded"
						style={{
							borderBottomLeftRadius: 'calc(var(--radius) - 2px)',
							borderBottomRightRadius: 'calc(var(--radius) - 2px)',
						}}
						onClick={(event) => event.stopPropagation()}
					>
						{consumers.map((consumer) => (
							<NodeItem variant="inline" key={consumer.name} parentId={id} data={consumer} />
						))}
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
	const { setEdges, setNodes } = useWorkflowEditor();

	const id = `${parentId}-source-handle-${index}`;

	const connections = useNodeConnections({
		handleType: 'source',
		handleId: id,
		onConnect(connections: Connection[]) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) => {
					if (edge.id === (connections[0] as unknown as any).edgeId) {
						console.dir({ edge, connection: connections[0] });

						return { ...edge, label: name === 'Next' ? '' : name };
					}
					return edge;
				}),
			);
		},
	});

	return (
		<Handle
			className="size-3 bg-emerald-500"
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
			className="size-3 bg-blue-400"
			id={id}
			style={{ marginTop: offset * 20 + 'px' }}
			type={'target'}
			position={Position.Left}
			isConnectable={true}
		/>
	);
}

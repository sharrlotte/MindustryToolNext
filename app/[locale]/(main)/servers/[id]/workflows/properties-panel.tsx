import { ArrowRight, XIcon } from 'lucide-react';
import { Suspense, useCallback } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';
import { updateProduce } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow.utils';

import ScrollContainer from '@/components/common/scroll-container';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';

import { useReactFlow } from '@xyflow/react';

import dynamic from 'next/dynamic';

const NodeItem = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/workflows/workflow-node-item'));

export default function PropertiesPanel({ node }: { node: WorkflowNode }) {
	const { id } = node;

	const {
		data: { name, fields, producers, outputs },
	} = node;
	const {
		actions: { setSelectedWorkflow },
	} = useWorkflowEditor();

	return (
		<ScrollContainer className="flex flex-col w-fit gap-2 bg-card px-2 p-2 border-l min-w-[min(50%,300px)] max-w-1/2 h-full">
			<div className="flex gap-1 items-center justify-between">
				<span className="text-xl">{name}</span>
				<Button size="icon" variant="icon" onClick={() => setSelectedWorkflow(null)}>
					<XIcon />
				</Button>
			</div>
			{fields.length > 0 && (
				<>
					<Divider />
					<div className="grid gap-1">
						<span>Properties</span>
						<div className="flex flex-col gap-2 text-muted-foreground text-sm">
							<Suspense>
								{fields.map((fields) => (
									<NodeItem variant="panel" key={fields.name} parentId={node.id} data={fields} />
								))}
							</Suspense>
						</div>
					</div>
				</>
			)}
			{producers.length > 0 && <Producers nodeId={id} producers={producers} />}
			{outputs.length > 0 && <Outputs outputs={outputs} />}
		</ScrollContainer>
	);
}

function Producers({ producers, nodeId }: { nodeId: string; producers: WorkflowNode['data']['producers'] }) {
	return (
		<>
			<Divider />
			<div className="grid gap-1">
				<span>Produces</span>
				<div className="flex flex-col gap-2 text-muted-foreground text-sm">
					{producers.map((producer, index) => (
						<Producer key={index} producer={producer} nodeId={nodeId} />
					))}
				</div>
			</div>
		</>
	);
}

function Producer({
	nodeId,
	producer: { name, variableName },
}: {
	nodeId: string;
	producer: WorkflowNode['data']['producers'][number];
}) {
	const { setNode } = useWorkflowEditor();

	return (
		<div className="grid gap-1">
			<span>{name}</span>
			<Input value={variableName} onChange={(e) => setNode(nodeId, (prev) => updateProduce(prev, name, e.currentTarget.value))} />
		</div>
	);
}

function Outputs({ outputs }: { outputs: WorkflowNode['data']['outputs'] }) {
	return (
		<>
			<Divider />
			<div className="grid gap-1">
				<span>Outputs</span>
				<div className="flex gap-2 text-muted-foreground text-sm">
					{outputs.map((output, index) => (
						<Output key={index} output={output} />
					))}
				</div>
			</div>
		</>
	);
}

function Output({ output: { name, nextId } }: { output: WorkflowNode['data']['outputs'][number] }) {
	const { nodes } = useWorkflowEditor();
	const nextNode = nodes.find((node) => node.id === nextId);

	return (
		<div className="flex items-center px-1.5 gap-0.5 py-0.5 rounded-full border text-xs text-muted-foreground">
			<span>{name}</span>
			{nextId ? (
				nextNode ? (
					<NextNode nextNode={nextNode} />
				) : (
					<span className="text-destructive-foreground">(Node not found)</span>
				)
			) : (
				<span>(Not connected)</span>
			)}
		</div>
	);
}

function NextNode({ nextNode }: { nextNode: WorkflowNode }) {
	const { setCenter } = useReactFlow();

	const moveToNextNode = useCallback(() => {
		if (nextNode) {
			const { x, y } = nextNode.position;
			const { width = 0, height = 0 } = nextNode;

			setCenter(x + width / 2, y + height / 2, {
				zoom: 1.5,
				duration: 800,
			});
		}
	}, [nextNode, setCenter]);

	const { color } = nextNode.data;

	return (
		<div className="flex items-center gap-1" onClick={moveToNextNode}>
			<ArrowRight className="size-4" />
			<span style={{ color }}>
				{nextNode.data.name}({nextNode.id.slice(0, 5)})
			</span>
		</div>
	);
}

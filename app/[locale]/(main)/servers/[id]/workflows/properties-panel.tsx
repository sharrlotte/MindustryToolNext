import { XIcon } from 'lucide-react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';
import NodeItem from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node-item';

import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';

export default function PropertiesPanel({ node }: { node: WorkflowNode }) {
	const { data } = node;
	const {
		actions: { setShowPropertiesPanel },
	} = useWorkflowEditor();

	return (
		<div className="flex flex-col gap-2 bg-card px-2 p-1 border-l min-w-[min(50%,300px)] max-w-1/2 h-full">
			<div className="flex gap-1 items-center justify-between">
				<span>Properties</span>
				<Button size="icon" variant="icon" onClick={() => setShowPropertiesPanel(null)}>
					<XIcon />
				</Button>
			</div>
			<Divider />
			<div className="grid gap-4 p-1 overflow-y-auto">
				{data.consumers.map((consumer) => (
					<NodeItem variant="panel" key={consumer.name} parentId={node.id} data={consumer} />
				))}
			</div>
			<Divider />
			<div>
				<span>Produces</span>
				<div className="flex flex-col gap-2 text-muted-foreground text-sm">
					{data.producers.map((producer, index) => (
						<div key={index} className="flex items-center gap-2">
							{producer.name}: {producer.type}
						</div>
					))}
				</div>
			</div>
			<Divider />
			<div>
				<span>Outputs</span>
				<div className="flex flex-col gap-2 text-muted-foreground text-sm">
					{data.outputs.map((output, index) => (
						<div key={index} className="flex items-center gap-2">
							{output.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

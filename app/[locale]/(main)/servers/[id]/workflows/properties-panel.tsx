import { XIcon } from 'lucide-react';
import { useState } from 'react';

import NodeItem from '@/app/[locale]/(main)/servers/[id]/workflows/node-item';
import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor.context';
import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';

import ComboBox from '@/components/common/combo-box';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { WorkflowNodeData } from '@/types/response/WorkflowContext';

import { cn } from '@/lib/utils';

export default function PropertiesPanel({ node }: { node: WorkflowNode }) {
	const { data } = node;
	const {
		actions: { setShowPropertiesPanel },
	} = useWorkflowEditor();

	return (
		<div className="flex flex-col gap-1 bg-card px-2 p-1 border-l min-w-[min(50%,300px)] max-w-1/2 h-full">
			<div className="flex gap-1 items-center justify-between">
				<span>Properties</span>
				<Button size="icon" variant="icon" onClick={() => setShowPropertiesPanel(null)}>
					<XIcon />
				</Button>
			</div>
			<div className="grid gap-4 p-1 overflow-y-auto">
				{data.consumers.map((consumer) => (
					<NodeItem variant="panel" key={consumer.name} parentId={node.id} data={consumer} />
				))}
			</div>
		</div>
	);
}

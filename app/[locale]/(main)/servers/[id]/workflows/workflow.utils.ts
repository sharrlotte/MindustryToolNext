import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';

export function updateConsume(node: WorkflowNode, name: string, value: any) {
	const fields = node.data.fields.find((fields) => fields.name === name);
	if (fields && fields.consumer) {
		fields.consumer.value = value;
	}

	return { ...node, data: { ...node.data, fields: node.data.fields } };
}

export function updateOutput(node: WorkflowNode, name: string, nextId: string) {
	const output = node.data.outputs.find((output) => output.name === name);
	if (output) {
		output.nextId = nextId;
	}

	return { ...node, data: { ...node.data, outputs: node.data.outputs } };
}

export function updateProduce(node: WorkflowNode, name: string, variableName: string) {
	const field = node.data.fields.find((field) => field.name === name);
	if (field && field.producer) {
		field.producer.variableName = variableName;
	}

	return { ...node, data: { ...node.data, producers: node.data.fields } };
}

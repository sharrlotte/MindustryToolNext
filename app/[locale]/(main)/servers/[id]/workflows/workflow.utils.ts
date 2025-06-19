import { WorkflowNode } from "@/app/[locale]/(main)/servers/[id]/workflows/workflow-node";

export function updateConsumer(node: WorkflowNode, name: string, value: any) {
    const consumer = node.data.consumers.find((consumer) => consumer.name === name);
    if (consumer) {
        consumer.value = value;
    }

    return { ...node, data: { ...node.data, consumers: node.data.consumers } };
}

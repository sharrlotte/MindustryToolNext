import { z } from 'zod/v4';

export const WorkflowNodeDataSchema = z.object({
	id: z.number(),
	x: z.number(),
	y: z.number(),
	name: z.string(),
	group: z.string(),
	color: z.string(),
	consumers: z.array(
		z.object({
			name: z.string(),
			type: z.string(),
			value: z.string(),
			required: z.boolean(),
			options: z.array(
				z.object({
					label: z.string(),
					value: z.string(),
				}),
			),
		}),
	),
	producers: z.array(
		z.object({
			name: z.string(),
			type: z.any(),
		}),
	),
	outputs: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			nextId: z.number(),
		}),
	),
});

export const WorkflowContextSchema = z.object({
	createdAt: z.number(),
	nodes: z.array(WorkflowNodeDataSchema),
});

export const GetWorkflowNodeDataSchema = z.record(z.string(),WorkflowNodeDataSchema);

export type WorkflowContext = z.infer<typeof WorkflowContextSchema>;
export type WorkflowNodeData = z.infer<typeof WorkflowNodeDataSchema>;

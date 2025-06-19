import { z } from 'zod/v4';

export const WorkflowNodeDataSchema = z.object({
	name: z.string(),
	group: z.string(),
	color: z.string(),
	consumers: z.array(
		z.object({
			name: z.string(),
			type: z.string(),
			value: z.string().optional().nullable(),
			required: z.boolean(),
			defaultValue: z.any().optional().nullable(),
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
		}),
	),
	inputs: z.number(),
});

export const WorkflowContextSchema = z.object({
	createdAt: z.number(),
	nodes: z.array(WorkflowNodeDataSchema),
});

export const GetWorkflowNodeDataSchema = z.record(z.string(), WorkflowNodeDataSchema);

export type WorkflowContext = z.infer<typeof WorkflowContextSchema>;
export type WorkflowNodeData = z.infer<typeof WorkflowNodeDataSchema>;

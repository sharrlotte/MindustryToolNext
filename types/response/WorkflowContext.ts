import { z } from 'zod/v4';

const WorkflowConsumerUnits = ['SECOND'] as const;

export const WorkflowNodeDataSchema = z.object({
	id: z.string().optional().nullable(),
	name: z.string(),
	group: z.string(),
	color: z.string(),
	consumers: z.array(
		z.object({
			name: z.string(),
			type: z.string(),
			value: z.string().optional().nullable(),
			required: z.boolean(),
			unit: z.enum(WorkflowConsumerUnits).optional().nullable(),
			defaultValue: z.any().optional().nullable(),
			produce: z
				.object({
					produceType: z.any().optional().nullable(),
					variableName: z.string().optional().nullable(),
				})
				.optional()
				.nullable(),
			options: z.array(
				z.object({
					label: z.string(),
					value: z.string(),
					produceType: z.any().optional().nullable(),
				}),
			),
		}),
	),
	producers: z.array(
		z.object({
			name: z.string(),
			type: z.any(),
			variableName: z.string(),
		}),
	),
	outputs: z.array(
		z.object({
			name: z.string(),
			description: z.string().optional().nullable(),
			nextId: z.string().optional().nullable(),
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

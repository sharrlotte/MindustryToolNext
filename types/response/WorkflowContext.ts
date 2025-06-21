import { z } from 'zod/v4';

const WorkflowFieldUnits = ['SECOND'] as const;

export const WorkflowFieldConsume = z.object({
	type: z.string(),
	value: z.string().optional().nullable(),
	required: z.boolean(),
	unit: z.enum(WorkflowFieldUnits).optional().nullable(),
	defaultValue: z.any().optional().nullable(),
	options: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
			produceType: z.any().optional().nullable(),
		}),
	),
});

export type WorkflowFieldConsume = z.infer<typeof WorkflowFieldConsume>;

export const WorkflowFieldProduce = z.object({
	produceType: z.any().optional().nullable(),
	variableName: z.string(),
});

export type WorkflowFieldProduce = z.infer<typeof WorkflowFieldProduce>;

export const WorkflowFieldSchema = z.object({
	name: z.string(),
	consumer: WorkflowFieldConsume.optional().nullable(),
	producer: WorkflowFieldProduce.optional().nullable(),
});

export type WorkflowField = z.infer<typeof WorkflowFieldSchema>;

export const WorkflowOutputSchema = z.object({
	name: z.string(),
	description: z.string().optional().nullable(),
	nextId: z.string().optional().nullable(),
});

export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;

export const WorkflowNodeDataSchema = z.object({
	id: z.string().optional().nullable(),
	name: z.string(),
	group: z.string(),
	color: z.string(),
	fields: z.array(WorkflowFieldSchema),
	outputs: z.array(WorkflowOutputSchema),
	inputs: z.number(),
});

export const WorkflowContextSchema = z.object({
	createdAt: z.number(),
	nodes: z.array(WorkflowNodeDataSchema),
});

export const GetWorkflowNodeDataSchema = z.record(z.string(), WorkflowNodeDataSchema);

export type WorkflowContext = z.infer<typeof WorkflowContextSchema>;
export type WorkflowNodeData = z.infer<typeof WorkflowNodeDataSchema>;

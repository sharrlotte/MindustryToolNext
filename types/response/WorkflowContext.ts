import { z } from 'zod/v4';

export const WorkflowNodeStateFieldSchema = z.object({
	consumer: z.any().optional().nullable(),
	producer: z.any().optional().nullable(),
	variableName: z.string().optional().nullable(),
});

export const WorkflowNodeStateSchema = z.object({
	outputs: z.record(z.string(), z.string()),
	fields: z.record(z.string(), WorkflowNodeStateFieldSchema),
});

export const WorkflowNodeDataSchema = z.object({
	id: z.string(),
	name: z.string(),
	state: WorkflowNodeStateSchema,
});

export type WorkflowNodeData = z.infer<typeof WorkflowNodeDataSchema>;
export type WorkflowNodeStateField = z.infer<typeof WorkflowNodeStateFieldSchema>;
export type WorkflowNodeState = z.infer<typeof WorkflowNodeStateSchema>;

const WorkflowFieldUnits = ['SECOND', 'MILLISECOND', 'MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];

export const WorkflowFieldConsume = z.object({
	type: z.string(),
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
});

export type WorkflowOutput = z.infer<typeof WorkflowOutputSchema>;

export const WorkflowNodeTypeSchema = z.object({
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

export const GetWorkflowNodeTypeSchema = z.record(z.string(), WorkflowNodeTypeSchema);

export type WorkflowContext = z.infer<typeof WorkflowContextSchema>;
export type WorkflowNodeType = z.infer<typeof WorkflowNodeTypeSchema>;

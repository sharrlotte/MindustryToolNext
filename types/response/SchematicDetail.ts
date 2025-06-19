import { StatusSchema } from '@/types/response/Status';
import { DetailTagDtoSchema } from '@/types/response/Tag';

import { ItemRequirementSchema } from './ItemRequirement';
import { z } from 'zod/v4';

export const SchematicDetailSchema = z.object({
	id: z.string(),
	name: z.string(),
	userId: z.string(),
	description: z.string(),
	metadata: z.object({
		requirements: z.array(ItemRequirementSchema),
	}),
	tags: z.array(DetailTagDtoSchema),
	likes: z.number(),
	dislikes: z.number(),
	height: z.number(),
	width: z.number(),
	status: StatusSchema,
	verifierId: z.string().optional(),
	itemId: z.string(),
	isVerified: z.boolean(),
	downloadCount: z.number(),
	createdAt: z.string(),
});

export type SchematicDetail = z.infer<typeof SchematicDetailSchema>;

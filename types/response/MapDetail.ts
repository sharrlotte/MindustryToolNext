import { StatusSchema } from '@/types/response/Status';
import { DetailTagDtoSchema } from '@/types/response/Tag';

import { z } from 'zod/v4';

export const MapDetailSchema = z.object({
	id: z.string(),
	name: z.string(),
	userId: z.string(),
	description: z.string(),
	tags: z.array(DetailTagDtoSchema),
	likes: z.number(),
	dislikes: z.number(),
	height: z.number(),
	width: z.number(),
	status: StatusSchema,
	verifierId: z.string(),
        itemId: z.string(),
        isVerified: z.boolean(),
        downloadCount: z.number(),
        viewCount: z.number(),
        createdAt: z.string(),
        meta: z.any(),
});

export type MapDetail = z.infer<typeof MapDetailSchema>;

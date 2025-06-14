import { z } from 'zod';

export const TAG_GROUP_SCHEMA = z
	.array(
		z.object({
			name: z.string(),
			values: z.array(z.object({ name: z.string(), count: z.number() })),
			color: z.string(),
			duplicate: z.boolean(),
			position: z.number(),
		}),
	)
	.min(0, { message: 'tag.min-tags-size' })
	.max(20, { message: 'tag.max-tags-size' });

import { z } from 'zod/v4';

export const CommentSchema = z.object({
	id: z.string(),
	userId: z.string(),
	content: z.string(),
	attachments: z.array(z.string()),
	path: z.string(),
	createdAt: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;

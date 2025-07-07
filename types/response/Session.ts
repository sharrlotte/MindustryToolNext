import { RoleSchema } from '@/types/response/Role';

import z from 'zod/v4';

export const SessionSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	imageUrl: z.string(),
	roles: z.array(RoleSchema),
	authorities: z.array(z.string()),
	lastLogin: z.number(),
	createdAt: z.number(),
	stats: z.any(),
	isBanned: z.boolean(),
});

export type Session = z.infer<typeof SessionSchema>;

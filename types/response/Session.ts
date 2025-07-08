import { RoleSchema } from '@/types/response/Role';

import z from 'zod/v4';

export const SessionSchema = z.object({
	id: z.string(),
	name: z.string(),
	imageUrl: z.string().nullish(),
	roles: z.array(RoleSchema),
	authorities: z.array(z.string()),
	createdAt: z.number().optional(),
	stats: z.any().nullish(),
	isBanned: z.boolean().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

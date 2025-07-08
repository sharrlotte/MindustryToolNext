import { ServerModes } from '@/types/request/UpdateServerRequest';

import { z } from 'zod/v4';

export const CreateServerSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().min(3).max(200),
	mode: z.enum(ServerModes),
	hostCommand: z.string().max(1000).optional(),
	gamemode: z.string().max(100).optional(),
	managerId: z.string().max(100).nullish(),
});

export type CreateServerRequest = z.infer<typeof CreateServerSchema>;

const HTTPS_REGEX = /(https:\/\/[^\s"']+)|(localhost)/g;

export const CreateServerManagerSchema = z.object({
	name: z.string().min(3).max(100),
	address: z.string().min(1).max(100).regex(HTTPS_REGEX, 'Invalid url'),
});

export type CreateServerManagerRequest = z.infer<typeof CreateServerManagerSchema>;

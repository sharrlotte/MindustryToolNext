import { z } from 'zod';

export const ServerModes = ['SURVIVAL', 'ATTACK', 'PVP', 'SANDBOX'] as const;

export type ServerMode = (typeof ServerModes)[number];

export const PutServerSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().min(1).max(200),
	mode: z.enum(ServerModes).default('SURVIVAL'),
	gamemode: z.string().max(100).optional(),
	hostCommand: z.string().max(1000).optional().nullable(),
	webhook: z.string().max(1000).optional().nullable(),
	avatar: z.string().max(1000).optional().nullable(),
	image: z.string().max(1000),
});

export type PutServerRequest = z.infer<typeof PutServerSchema>;

export const PutServerPortSchema = z.object({
	port: z.coerce.number().min(1).int(),
	isOfficial: z.boolean(),
	isHub: z.boolean(),
	isAutoTurnOff: z.boolean(),
});

export type PutServerPortRequest = z.infer<typeof PutServerPortSchema>;

import { z } from 'zod/v4';


export const ServerModes = ['SURVIVAL', 'ATTACK', 'PVP', 'SANDBOX'] as const;

export const ServerModeSchema = z.enum(ServerModes);

export type ServerMode = (typeof ServerModes)[number];

export const PutServerSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().min(1).max(200),
	mode: z.enum(ServerModes),
	gamemode: z.string().max(100).optional().nullable(),
	hostCommand: z.string().max(1000).optional().nullable(),
	webhook: z.string().max(1000).optional().nullable(),
	discordChannelId: z.string().max(100).optional().nullable(),
	avatar: z.string().max(1000).optional().nullable(),
	image: z.string().max(1000),
});

export type PutServerRequest = z.infer<typeof PutServerSchema>;

export const PutServerPortSchema = z.object({
	port: z.number().min(1).int(),
	isOfficial: z.boolean(),
	isHub: z.boolean(),
	isAutoTurnOff: z.boolean(),
});

export type PutServerPortRequest = z.infer<typeof PutServerPortSchema>;

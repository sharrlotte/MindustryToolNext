import z from 'zod/v4-mini';

export const ServerModes = ['SURVIVAL', 'ATTACK', 'PVP', 'SANDBOX'] as const;

export const ServerModeSchema = z.enum(ServerModes);

export type ServerMode = (typeof ServerModes)[number];

export const UpdateServerSchema = z.object({
	name: z.string().check(z.minLength(1), z.maxLength(100), z.trim()),
	description: z.string().check(z.minLength(1), z.maxLength(200), z.trim()),
	mode: z.enum(ServerModes),
	gamemode: z.nullable(z.optional(z.string().check(z.maxLength(100), z.trim()))),
	hostCommand: z.nullable(z.optional(z.string().check(z.maxLength(1000), z.trim()))),
	webhook: z.nullable(z.optional(z.string().check(z.maxLength(1000), z.trim()))),
	discordChannelId: z.nullable(z.optional(z.string().check(z.maxLength(100), z.trim()))),
	avatar: z.nullable(z.optional(z.string().check(z.maxLength(1000), z.trim()))),
	image: z.string().check(z.maxLength(1000), z.trim()),
});

export type UpdateServerRequest = z.infer<typeof UpdateServerSchema>;

export const UpdateServerPortSchema = z.object({
	port: z.number().check(z.gte(1)),
	isOfficial: z.boolean(),
	isHub: z.boolean(),
	isAutoTurnOff: z.boolean(),
});

export type UpdateServerPortRequest = z.infer<typeof UpdateServerPortSchema>;

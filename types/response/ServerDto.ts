import { ServerStatusSchema } from '@/constant/constant';
import { ServerModeSchema } from '@/types/request/UpdateServerRequest';
import { ServerPlanSchema } from '@/types/response/ServerPlan';

import { z } from 'zod/v4';

export const ServerDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
	userId: z.string(),
	description: z.string(),
	port: z.number(),
	isOfficial: z.boolean(),
	mode: ServerModeSchema,
	gamemode: z.string().optional(),
	status: ServerStatusSchema,
	ramUsage: z.number(),
	jvmRamUsage: z.number(),
	cpuUsage: z.number(),
	totalRam: z.number(),
	players: z.number(),
	mapName: z.string(),
	address: z.string(),
	avatar: z.string(),
	discordChannelId: z.string().nullable(),
	isAutoTurnOff: z.boolean(),
	isHub: z.boolean(),
	isPaused: z.boolean(),
	hostCommand: z.string().optional(),
	kicks: z.number(),
	errors: z.array(z.string()),
	planId: z.number(),
	plan: ServerPlanSchema,
	image: z.string(),
	version: z.string(),
    startedAt: z.number()
});

export type ServerDto = z.infer<typeof ServerDtoSchema>;

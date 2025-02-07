import { z } from 'zod';

export const ServerModes = ['SURVIVAL', 'ATTACK', 'PVP', 'SANDBOX'] as const;

export type ServerMode = (typeof ServerModes)[number];

export const PutServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  mode: z.enum(ServerModes).default('SURVIVAL'),
  hostCommand: z.string().max(1000).optional().nullable(),
  webhook: z.string().max(1000).optional().nullable(),
});

export type PutServerRequest = z.infer<typeof PutServerSchema>;

export const PutServerPortSchema = z.object({
  port: z.coerce.number().min(1).int(),
  isOfficial: z.boolean(),
  isHub: z.boolean(),
  isAutoTurnOff: z.boolean(),
});

export type PutServerPortRequest = z.infer<typeof PutServerPortSchema>;

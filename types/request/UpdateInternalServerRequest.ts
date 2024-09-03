import { z } from 'zod';

export const InternalServerModes = [
  'SURVIVAL',
  'ATTACK',
  'PVP',
  'SANDBOX',
] as const;

export type InternalServerMode = (typeof InternalServerModes)[number];

export const PutInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
  startCommand: z.string().max(1000).optional(),
});

export type PutInternalServerRequest = z.infer<typeof PutInternalServerSchema>;

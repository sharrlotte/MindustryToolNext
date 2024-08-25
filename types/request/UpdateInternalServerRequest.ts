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
  description: z.string().min(1).max(100),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
});

export type PutInternalServerRequest = z.infer<typeof PutInternalServerSchema>;

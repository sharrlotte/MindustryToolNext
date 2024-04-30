import { z } from 'zod';

export const InternalServerModes = ['SURVIVAL', 'ATTACK', 'PVP'] as const;

export const PutInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
  port: z.number().min(6567).max(7000),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
});

export type PutInternalServerRequest = z.infer<typeof PutInternalServerSchema>;

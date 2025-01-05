import { z } from 'zod';

import { InternalServerModes } from '@/types/request/UpdateInternalServerRequest';

export const CreateInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
  hostCommand: z.string().max(1000).optional(),
});

export type CreateInternalServerRequest = z.infer<typeof CreateInternalServerSchema>;

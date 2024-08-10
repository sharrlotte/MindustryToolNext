import { z } from 'zod';

import { InternalServerModes } from '@/types/request/UpdateInternalServerRequest';

export const CreateInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
  port: z.number().min(6567).max(7000),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
});

export type CreateInternalServerRequest = z.infer<
  typeof CreateInternalServerSchema
>;

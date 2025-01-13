import { z } from 'zod';

import { InternalServerModes } from '@/types/request/UpdateInternalServerRequest';

export const CreateInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
  hostCommand: z.string().max(1000).optional(),
  gamemode: z.string().max(100).optional(),
  managerId: z.string().max(100).optional(),
});

export type CreateInternalServerRequest = z.infer<typeof CreateInternalServerSchema>;

const HTTPS_REGEX = /(https:\/\/[^\s"']+)|(localhost)/g;

export const CreateServerManagerSchema = z.object({
  name: z.string().min(1).max(50),
  address: z.string().min(1).max(50).regex(HTTPS_REGEX, 'Invalid url'),
});

export type CreateServerManagerRequest = z.infer<typeof CreateServerManagerSchema>;

import { InternalServerModes } from '@/types/request/PutInternalServerRequest';
import { z } from 'zod';

export const PostInternalServerSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(100),
  port: z.number().min(6567).max(7000),
  mode: z.enum(InternalServerModes).default('SURVIVAL'),
  discordChannelId: z.string().max(100),
});

export type PostInternalServerRequest = z.infer<
  typeof PostInternalServerSchema
>;

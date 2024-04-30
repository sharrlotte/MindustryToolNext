import { z } from 'zod';
import { sortSchema } from '@/types/data/schemas';
import { verifyStatus } from '@/types/response/Status';

export const searchSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default('').optional(),
  authorId: z.string().default('').optional(),
  tags: z.array(z.string()).default([]).optional(),
  sort: sortSchema.optional(),
  items: z.number().gte(0).lte(100).optional().default(20),
});

export type PaginationSearchQuery = z.infer<typeof searchSchema>;

export type PaginationQuery = {
  page: number;
  items: number;
};

export const statusSearchSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default('').optional(),
  authorId: z.string().default('').optional(),
  tags: z.array(z.string()).default([]).optional(),
  sort: sortSchema.optional(),
  status: z.enum(verifyStatus).default('UNSET'),
  items: z.number().gte(0).lte(100).optional().default(20),
});

export type StatusPaginationSearchQuery = z.infer<typeof statusSearchSchema>;

export const pluginSearchSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default('').optional(),
  tags: z.array(z.string()).default([]).optional(),
  items: z.number().gte(0).lte(100).optional().default(20),
});

export type PluginPaginationQuery = z.infer<typeof pluginSearchSchema>;

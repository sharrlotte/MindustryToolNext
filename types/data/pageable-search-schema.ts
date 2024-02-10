import { z } from 'zod';
import { sortSchema } from '@/types/data/schemas';

export const searchSchema = z.object({
  page: z.number().gte(0).default(0).optional(),
  name: z.string().default('').optional(),
  authorId: z.string().default('').optional(),
  tags: z.array(z.string()).default([]).optional(),
  sort: sortSchema.optional(),
});

export type PaginationSearchQuery = z.infer<typeof searchSchema>;

export type PaginationQuery = {
  page?: number;
};

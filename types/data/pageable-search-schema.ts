import { z } from 'zod';
import { sortSchema } from '@/types/data/schemas';

export const searchSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default(''),
  authorId: z.string().default(''),
  tags: z.array(z.string()).default([]),
  sort: sortSchema,
});

export type PaginationSearchQuery = z.infer<typeof searchSchema>;

export type PaginationQuery = {
  page: number;
};

import { z } from 'zod';

import { defaultSortTag } from '@/constant/env';
import { sortTag } from '@/types/response/SortTag';

export const sortSchema = z
  .enum(sortTag)
  .default(defaultSortTag)
  .catch(defaultSortTag);

export type QuerySchema = typeof ItemPaginationQuery | typeof PaginationQuery;

const PaginationParam = {
  size: z.coerce.number().gte(1).default(20),
  page: z.coerce.number().gte(0).default(0),
};

const ItemSearchParam = {
  name: z.string().optional(),
  authorId: z.string().optional(),
  tags: z
    .any()
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .default([])
    .optional(),
  sort: sortSchema.optional(),
};

const PaginationQuery = z.object({
  ...PaginationParam,
});

const ItemPaginationQuery = z.object({
  ...PaginationParam,
  ...ItemSearchParam,
});

export { PaginationQuery, ItemPaginationQuery };

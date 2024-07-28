import { useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { sortSchema } from '@/types/data/schemas';

type QuerySchema = typeof ItemPaginationQuery | typeof PaginationQuery;

export default function useSearchQuery<T extends QuerySchema>(
  schema: T,
): z.infer<typeof schema> {
  const query = useSearchParams();
  const data = Object.fromEntries(query.entries());

  const result = schema.parse(data);

  return result;
}

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

import { z } from 'zod';

import { defaultSortTag } from '@/constant/env';
import { sortTag } from '@/types/response/SortTag';
import { locales } from '@/i18n/client';

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
  sort: sortSchema,
};

const Language = z.enum(locales).default('vi');

export const PaginationQuery = z.object({
  ...PaginationParam,
});

export const ItemPaginationQuery = z.object({
  ...PaginationParam,
  ...ItemSearchParam,
});

export const TranslationPaginationQuery = z.object({
  ...PaginationParam,
  language: Language,
});

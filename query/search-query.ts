import { z } from 'zod';

import { defaultSortTag } from '@/constant/env';
import { locales } from '@/i18n/config';
import { sortTag } from '@/types/response/SortTag';
import { verifyStatus } from '@/types/response/Status';

type Pageable = {
  page: number;
};

export default Pageable;

export const sortSchema = z.enum(sortTag).default(defaultSortTag).optional().catch(defaultSortTag);
export const sizeSchema = z.coerce.number().gte(1).default(30).catch(30);
export const pageSchema = z.coerce.number().gte(0).default(0).catch(0);
export const nameSchema = z.string().optional();
export const authorIdSchema = z.string().optional();
export const tagsSchema = z
  .any()
  .transform((value) => (Array.isArray(value) ? value : [value]))
  .default([])
  .optional();

export const languageSchema = z.enum(locales).default('en').catch('en');
export const targetLanguageSchema = z.enum(locales).default('vi').catch('vi');
export const languageKeySchema = z.string().optional();

export type QuerySchema = typeof ItemPaginationQuery | typeof PaginationQuerySchema;

const PaginationParam = {
  size: sizeSchema,
  page: pageSchema,
};

const ItemSearchParam = {
  name: nameSchema,
  authorId: authorIdSchema,
  tags: tagsSchema,
  sort: sortSchema,
};

export const PaginationQuerySchema = z.object({
  ...PaginationParam,
});

export const ItemPaginationQuery = z.object({
  ...PaginationParam,
  ...ItemSearchParam,
});

export type ItemPaginationQueryType = z.infer<typeof ItemPaginationQuery>;

export const TranslationPaginationQuery = z.object({
  ...PaginationParam,
  language: languageSchema,
  target: targetLanguageSchema,
  key: languageKeySchema,
});

export type PaginationQuery = {
  page: number;
  size: number;
};

export type MessageQuery = {
  size: number;
};

export const StatusSearchSchema = z.object({
  ...PaginationParam,
  ...ItemSearchParam,
  status: z.enum(verifyStatus).default('UNSET'),
});

export type StatusPaginationSearchQuery = z.infer<typeof StatusSearchSchema>;

export const PluginSearchSchema = z.object({
  ...PaginationParam,
  tags: tagsSchema,
});

export type PluginPaginationQuery = z.infer<typeof PluginSearchSchema>;

export type DocumentPaginationQuery = Omit<PluginPaginationQuery, 'tags'>;

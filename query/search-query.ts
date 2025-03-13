import { z } from 'zod';

import { userRoles } from '@/constant/enum';
import { defaultSortTag } from '@/constant/env';
import { DEFAULT_PAGINATION_SIZE } from '@/context/session-context.type';
import { locales } from '@/i18n/config';
import { sortTag } from '@/types/response/SortTag';
import { verifyStatus } from '@/types/response/Status';

type Pageable = {
  page: number;
};

export default Pageable;

export const sortSchema = z.enum(sortTag).default(defaultSortTag).optional().catch(defaultSortTag);
export const sizeSchema = z.coerce.number().gte(1).default(DEFAULT_PAGINATION_SIZE).catch(DEFAULT_PAGINATION_SIZE);
export const pageSchema = z.coerce.number().gte(0).default(0).catch(0);
export const nameSchema = z.string().optional();
export const roleSchema = z.enum(userRoles).optional();
export const isBannedSchema = z.boolean().optional();
export const authorIdSchema = z.string().optional();
export const tagsSchema = z
  .any()
  .transform((value) => (Array.isArray(value) ? value : [value]))
  .default([])
  .optional();

export const languageSchema = z.enum(locales).default('en').catch('en');
export const targetLanguageSchema = z.enum(locales).default('vi').catch('vi');
export const languageKeySchema = z.string().optional();
export const isTranslatedSchema = z.boolean().optional().nullable();

export type QuerySchema = typeof PaginationQuerySchema;

const PaginationParam = {
  size: sizeSchema,
  page: pageSchema,
};

export const SearchUserQuerySchema = z.object({
  ...PaginationParam,
  role: roleSchema,
  is_banned: isBannedSchema,
  name: nameSchema,
});

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

export type CountItemPaginationQueryType = Omit<ItemPaginationQueryType, 'page' | 'size'>;

export const TranslationPaginationQuery = z.object({
  ...PaginationParam,
  language: languageSchema,
  target: targetLanguageSchema,
  key: languageKeySchema,
  isTranslated: isTranslatedSchema,
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

export const logEnvs = ['Prod', 'Dev'] as const;
export type LogEnvironment = (typeof logEnvs)[number];

export const LogPaginationQuerySchema = z.object({
  ...PaginationParam,
  collection: z.string().default('SERVER').optional(),
  env: z.enum(['Prod', 'Dev']).default('Prod'),
  ip: z.string().optional(),
  userId: z.string().optional(),
  url: z.string().optional(),
  content: z.string().optional(),
  before: z.string().optional(),
  after: z.string().optional(),
});

export type LogPaginationQueryType = z.infer<typeof LogPaginationQuerySchema>;

export const commentSorts = ['newest', 'oldest'] as const;

export type CommentSort = (typeof commentSorts)[number];

export const CommentPaginationQuerySchema = z.object({
  ...PaginationParam,
  sort: z.enum(commentSorts).default('newest').catch(""),
});

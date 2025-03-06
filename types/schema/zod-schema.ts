import { z } from 'zod';

import { TranslateFunction } from '@/i18n/config';
import { TagGroups } from '@/types/response/TagGroup';

export const TAG_GROUP_SCHEMA = z
  .array(
    z.object({
      name: z.string(),
      values: z.array(z.object({ name: z.string(), count: z.number() })),
      color: z.string(),
      duplicate: z.boolean(),
      position: z.number(),
    }),
  )
  .min(1, { message: 'tag.min-tags-size' })
  .max(20, { message: 'tag.max-tags-size' })
  .transform<string>((value) => TagGroups.toString(value));

export const CreateSchematicSchema = (t: TranslateFunction) =>
  z.object({
    name: z.string().min(1).max(128),
    description: z.string().max(1024).optional(),
    data: z.any(),
    tags: TAG_GROUP_SCHEMA,
  });

export type CreateSchematicRequest = z.infer<ReturnType<typeof CreateSchematicSchema>>;

export const CreateMapSchema = (t: TranslateFunction) =>
  z.object({
    name: z.string().min(1).max(128),
    description: z.string().max(1024).optional(),
    file: z.any(),
    isPrivate: z.boolean().default(false),
    tags: TAG_GROUP_SCHEMA,
  });

export type CreateMapRequest = z.infer<ReturnType<typeof CreateMapSchema>>;

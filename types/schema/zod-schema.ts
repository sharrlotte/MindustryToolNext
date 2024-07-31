import { z } from 'zod';

import { TranslateFunction } from '@/i18n/config';
import { TagGroups } from '@/types/response/TagGroup';

export const TAG_GROUP_SCHEMA = z.object({
  name: z.string(),
  values: z.array(z.string()).default([]),
  color: z.string(),
  duplicate: z.boolean(),
});

export const UploadSchematicSchema = (t: TranslateFunction) =>
  z.object({
    name: z.string().min(1).max(128),
    description: z.string().max(1024).optional(),
    data: z.any(),
    tags: z
      .array(TAG_GROUP_SCHEMA)
      .min(1, { message: t('upload-schematic.min-tags-size') })
      .max(20, { message: t('upload-schematic.max-tags-size') })
      .transform<string>((value) => TagGroups.toString(value)),
  });

export type UploadSchematicRequest = z.infer<
  ReturnType<typeof UploadSchematicSchema>
>;
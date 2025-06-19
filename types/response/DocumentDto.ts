import { LOCALE_SCHEMA } from '@/types/schema/zod-schema';

import { z } from 'zod/v4';

export const DocumentDtoSchema = z.object({
	id: z.string(),
	path: z.string(),
	userId: z.string(),
	itemId: z.string(),
	treeId: z.string(),
	title: z.string(),
	language: LOCALE_SCHEMA,
	updatedAt: z.string(),
	createdAt: z.string(),
});

export type DocumentDto = z.infer<typeof DocumentDtoSchema>;

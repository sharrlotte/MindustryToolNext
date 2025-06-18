import { JSON_SCHEMA } from '@/types/schema/zod-schema';

import { z } from 'zod/v4';

export const DocumentSchema = z.object({
	id: z.string(),
	text: z.string(),
	metadata: JSON_SCHEMA,
});

export type Document = z.infer<typeof DocumentSchema>;

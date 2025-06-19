import { locales } from '@/i18n/config';

import { z } from 'zod/v4';

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
	.min(1)
	.max(20);

export const JSON_SCHEMA = z.string().transform((str, ctx): z.infer<ReturnType<any>> => {
	try {
		return JSON.parse(str);
	} catch (e) {
		ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
		return z.NEVER;
	}
});

export const LOCALE_SCHEMA = z.enum(locales);

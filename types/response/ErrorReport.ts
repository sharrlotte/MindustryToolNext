import { errorStatus } from '@/constant/constant';

import { z } from 'zod/v4';

export const ErrorStatusSchema = z.enum(errorStatus);

export const ErrorReportSchema = z.object({
	id: z.string(),
	content: z.object({
		errors: z.string(),
		message: z.string().nullable(),
		url: z.string(),
		user: z.string(),
	}),
	ip: z.string(),
	status: z.enum(errorStatus),
	createdAt: z.number(),
});

export type ErrorReport = z.infer<typeof ErrorReportSchema>;

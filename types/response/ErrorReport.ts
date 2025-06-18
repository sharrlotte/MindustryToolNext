import { errorStatus } from '@/constant/constant';

import { z } from 'zod/v4';

export const ErrorStatusSchema = z.enum(errorStatus);

export const ErrorReportSchema = z.object({
	id: z.string(),
	content: z.any(),
	ip: z.string(),
	status: z.enum(errorStatus),
	createdAt: z.number(),
});

export type ErrorReport = z.infer<typeof ErrorReportSchema>;

import { z } from 'zod/v4';

export const ServerPlanSchema = z.object({
	id: z.number(),
	name: z.string(),
	cpu: z.number(),
	ram: z.number(),
});

export type ServerPlan = z.infer<typeof ServerPlanSchema>;

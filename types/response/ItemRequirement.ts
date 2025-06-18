import { z } from 'zod/v4';

export const ItemRequirementSchema = z.object({
	name: z.string(),
	color: z.string(),
	amount: z.number().min(1),
});

export type ItemRequirement = z.infer<typeof ItemRequirementSchema>;

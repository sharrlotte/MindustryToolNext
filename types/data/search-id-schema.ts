import { z } from "zod";

export const searchIdSchema = z.object({
  id: z.string(),
});

export type IdSearchParams = z.infer<typeof searchIdSchema>;

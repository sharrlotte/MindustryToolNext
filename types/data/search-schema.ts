import { z } from "zod";
import { sortSchema } from "@/types/data/schema";

export const searchSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default(""),
  authorId: z.string().default(""),
  tags: z.array(z.string()).default([]),
  sort: sortSchema,
});

export type SearchParams = z.infer<typeof searchSchema>;

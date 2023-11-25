import cfg from "@/constant/global";
import { sortSchema } from "@/schema/schema";
import Schematic from "@/types/Schematic";
import { z } from "zod";

export const schematicSearchParamSchema = z.object({
  page: z.number().gte(0).default(0),
  name: z.string().default(""),
  authorId: z.string().default(""),
  tags: z.array(z.string()).default([]),
  sort: sortSchema,
});
export type GetSchematicParams = z.infer<typeof schematicSearchParamSchema>;

export default async function getSchematics(
  params: GetSchematicParams,
): Promise<Schematic[]> {
  const { page, name, authorId, tags, sort } =
    schematicSearchParamSchema.parse(params);

  const result = await fetch(
    `${cfg.apiUrl}/schematics?` +
      new URLSearchParams({
        page: page.toString(),
        name,
        authorId,
        sort,
        tags: tags.join(","),
        items: "20",
      }),
  );

  if (!result.ok) {
    throw new Error("Failed to fletch data");
  }

  return result.json();
}

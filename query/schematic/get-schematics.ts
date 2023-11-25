import cfg from "@/constant/global";
import { SearchParams, searchSchema } from "@/schema/search-schema";
import Schematic from "@/types/Schematic";

export default async function getSchematics(
  params: SearchParams,
): Promise<Schematic[]> {
  const { page, name, authorId, tags, sort } = searchSchema.parse(params);

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

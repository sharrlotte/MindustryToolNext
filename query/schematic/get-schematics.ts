import axiosClient from "@/query/config/axios-config";
import { SearchParams, searchSchema } from "@/schema/search-schema";
import Schematic from "@/types/Schematic";

export default async function getSchematics(
  params: SearchParams,
): Promise<Schematic[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axiosClient.get("/schematics", {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}

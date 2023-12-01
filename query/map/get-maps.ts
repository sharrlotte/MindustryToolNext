import axiosClient from "@/query/config/axios-config";
import { SearchParams, searchSchema } from "@/schema/search-schema";
import Map from "@/types/response/Map";

export default async function getMaps(params: SearchParams): Promise<Map[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axiosClient.get("/maps", {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}

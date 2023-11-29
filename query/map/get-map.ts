import axiosClient from "@/query/config/axios-config";
import { IdSearchParams } from "@/schema/search-id-schema";
import Map from "@/types/Map";

export default async function getSchematic({
  id,
}: IdSearchParams): Promise<Map> {
  const result = await axiosClient.get(`/maps/${id}`);
  return result.data;
}

import axiosClient from "@/query/config/axios-config";
import { IdSearchParams } from "@/schema/search-id-schema";
import Map from "@/types/response/Map";

export default async function getMap({
  id,
}: IdSearchParams): Promise<Map> {
  const result = await axiosClient.get(`/maps/${id}`);
  return result.data;
}

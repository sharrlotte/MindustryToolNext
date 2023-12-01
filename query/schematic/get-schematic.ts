import axiosClient from "@/query/config/axios-config";
import { IdSearchParams } from "@/schema/search-id-schema";
import Schematic from "@/types/response/Schematic";

export default async function getSchematic({
  id,
}: IdSearchParams): Promise<Schematic> {
  const result = await axiosClient.get(`/schematics/${id}`);
  return result.data;
}

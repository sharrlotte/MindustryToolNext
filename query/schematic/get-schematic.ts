import { IdSearchParams } from '@/types/data/id-search-schema';
import Schematic from '@/types/response/Schematic';
import { AxiosInstance } from 'axios';

export default async function getSchematic(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<Schematic> {
  const result = await axios.get(`/schematics/${id}`);
  return result.data;
}

import { IdSearchParams } from '@/types/data/id-search-schema';
import { MapDetail } from '@/types/response/MapDetail';
import { AxiosInstance } from 'axios';

export default async function getMap(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<MapDetail> {
  const result = await axios.get(`/maps/${id}`);
  return result.data;
}

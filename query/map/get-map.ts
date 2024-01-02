import { IdSearchParams } from '@/types/data/id-search-schema';
import { Map } from '@/types/response/Map';
import { AxiosInstance } from 'axios';

export default async function getMap(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<Map> {
  const result = await axios.get(`/maps/${id}`);
  return result.data;
}

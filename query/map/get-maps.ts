import { SearchParams, searchSchema } from '@/types/data/search-schema';
import Map from '@/types/response/Map';
import { AxiosInstance } from 'axios';

export default async function getMaps(
  axios: AxiosInstance,
  params: SearchParams,
): Promise<Map[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/maps', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}

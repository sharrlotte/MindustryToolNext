import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/Map';

export default async function getMaps(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Map[]> {
  const result = await axios.get('/maps', {
    params,
  });

  return result.data;
}

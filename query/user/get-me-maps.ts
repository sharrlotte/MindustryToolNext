import { AxiosInstance } from 'axios';

import { StatusPaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/Map';

export default async function getMeMaps(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Map[]> {
  const result = await axios.get(`/users/@me/maps`, {
    params,
  });

  return result.data;
}

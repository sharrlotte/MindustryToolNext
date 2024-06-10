import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/Map';

export default async function getUserMaps(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Map[]> {
  const result = await axios.get(`/users/${userId}/maps`, {
    params,
  });

  return result.data;
}

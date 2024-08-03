import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export async function getMapCount(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<number> {
  const result = await axios.get('/maps/total', { params });

  return result.data;
}

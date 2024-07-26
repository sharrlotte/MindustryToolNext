import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export async function getSchematicCount(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<number> {
  const result = await axios.get('/schematics/total', { params });

  return result.data;
}

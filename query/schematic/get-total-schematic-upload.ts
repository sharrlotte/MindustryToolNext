import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export default async function getTotalSchematicUpload(
  axios: AxiosInstance,
  params: Omit<PaginationSearchQuery, 'page' | 'items'>,
): Promise<number> {
  const result = await axios.get('/schematics/upload/total', {
    params,
  });

  return result.data;
}

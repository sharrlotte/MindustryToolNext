import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';

export default async function getTotalMapUpload(
  axios: AxiosInstance,
  params: Omit<PaginationSearchQuery, 'page' | 'size'>,
): Promise<number> {
  const result = await axios.get('/maps/upload/total', {
    params,
  });

  return result.data;
}

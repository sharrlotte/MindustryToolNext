import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/Map';

export default async function getMapUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Map[]> {
  const result = await axios.get('/maps/upload', {
    params,
  });

  return result.data;
}

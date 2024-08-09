import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { MapPreview } from '@/types/response/MapPreview';

export default async function getMaps(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get('/maps', {
    params,
  });

  return result.data;
}

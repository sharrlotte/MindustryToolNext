import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { MapPreview } from '@/types/response/MapPreview';

export default async function getMapUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get('/maps/upload', {
    params,
  });

  return result.data;
}

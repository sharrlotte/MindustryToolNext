import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { MapPreview } from '@/types/response/MapPreview';

export default async function getUserMaps(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get(`/users/${userId}/maps`, {
    params,
  });

  return result.data;
}

import { AxiosInstance } from 'axios';

import { StatusPaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { MapPreview } from '@/types/response/MapPreview';

export default async function getMeMaps(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<MapPreview[]> {
  const result = await axios.get(`/users/@me/maps`, {
    params,
  });

  return result.data;
}

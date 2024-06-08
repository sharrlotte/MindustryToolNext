import {
  StatusPaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Map } from '@/types/response/Map';

import { AxiosInstance } from 'axios';

export default async function getMeMaps(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Map[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get(`/users/@me/maps`, {
    params: searchParams,
  });

  return result.data;
}

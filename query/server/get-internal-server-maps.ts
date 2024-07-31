import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { InternalServerMap } from '@/types/response/InternalServerMap';

export default async function getInternalServerMaps(
  axios: AxiosInstance,
  id: string,
  params: PaginationQuery,
): Promise<InternalServerMap[]> {
  const result = await axios.get(`/internal-servers/${id}/maps`, {
    params: params,
  });

  return result.data;
}

import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { InternalServerPlugin } from '@/types/response/InternalServerPlugin';

export default async function getInternalServerPlugins(
  axios: AxiosInstance,
  id: string,
  params: PaginationQuery,
): Promise<InternalServerPlugin[]> {
  const result = await axios.get(`/internal-servers/${id}/plugins`, {
    params: params,
  });

  return result.data;
}

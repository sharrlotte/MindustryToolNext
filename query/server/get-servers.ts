import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/types/data/pageable-search-schema';
import ExternalServer from '@/types/response/ExternalServer';

export default async function getServers(
  axios: AxiosInstance,
  params: PaginationQuery,
): Promise<ExternalServer[]> {
  const result = await axios.get(`/external-servers`, {
    params: {
      ...params,
      size: 40,
    },
  });

  return result.data;
}

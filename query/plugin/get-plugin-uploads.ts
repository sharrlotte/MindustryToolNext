import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Plugin } from '@/types/response/Plugin';

export default async function getPluginUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Plugin[]> {
  const result = await axios.get('/plugins/upload', {
    params,
  });

  return result.data;
}

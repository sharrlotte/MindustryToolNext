import { AxiosInstance } from 'axios';

import { PluginPaginationQuery } from '@/types/data/pageable-search-schema';
import { Plugin } from '@/types/response/Plugin';

export default async function getPlugins(
  axios: AxiosInstance,
  params: PluginPaginationQuery,
): Promise<Plugin[]> {
  const result = await axios.get('/plugins', {
    params,
  });

  return result.data;
}

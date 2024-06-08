import {
  PluginPaginationQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Plugin } from '@/types/response/Plugin';

import { AxiosInstance } from 'axios';

export default async function getPlugins(
  axios: AxiosInstance,
  params: PluginPaginationQuery,
): Promise<Plugin[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/plugins', {
    params: searchParams,
  });

  return result.data;
}

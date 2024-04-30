import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { QueryParams } from '@/query/config/search-query-params';
import {
  PluginPaginationQuery,
  pluginSearchSchema,
} from '@/types/data/pageable-search-schema';

export default function useSearchPageParams(): PluginPaginationQuery {
  const query = useSafeSearchParams();

  return pluginSearchSchema.parse({
    page: Number.parseInt(query.get(QueryParams.page, '0')),
    name: query.get(QueryParams.name),
    tags: query.getAll(QueryParams.tags),
    items: Number.parseInt(query.get(QueryParams.items, '20')),
  });
}

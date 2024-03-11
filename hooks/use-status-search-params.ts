import { defaultSortTag } from '@/constant/env';
import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { QueryParams } from '@/query/config/search-query-params';
import {
  StatusPaginationSearchQuery,
  statusSearchSchema,
} from '@/types/data/pageable-search-schema';

export default function useStatusSearchParams(): StatusPaginationSearchQuery {
  const query = useSafeSearchParams();

  return statusSearchSchema.parse({
    page: Number.parseInt(query.get(QueryParams.page, '0')),
    name: query.get(QueryParams.name),
    sort: query.get(QueryParams.sort, defaultSortTag),
    tags: query.getAll(QueryParams.tags),
    authorId: query.get(QueryParams.authorId),
  });
}

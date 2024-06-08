import { defaultSortTag } from '@/constant/env';
import useSafeSearchParams from '@/hooks/use-safe-search-params';
import { QueryParams } from '@/query/config/search-query-params';
import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';

export default function useSearchPageParams(): PaginationSearchQuery {
  const query = useSafeSearchParams();

  return searchSchema.parse({
    page: Number.parseInt(query.get(QueryParams.page, '0')),
    name: query.get(QueryParams.name),
    sort: query.get(QueryParams.sort, defaultSortTag),
    tags: query.getAll(QueryParams.tags),
    authorId: query.get(QueryParams.authorId),
    status: query.get(QueryParams.status),
    items: Number.parseInt(query.get(QueryParams.items, '20')),
  });
}

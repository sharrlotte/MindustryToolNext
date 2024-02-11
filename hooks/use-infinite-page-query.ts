import useClientAPI from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export default function useInfinitePageQuery<T, P extends PaginationQuery>(
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>,
  params: P,
  queryKey: QueryKey[],
) {
  const PaginationSearchQuery = useSearchPageParams();
  const { axios, enabled } = useClientAPI();

  const getNextPageParam = (lastPage: T[], pages: T[][], lastPageParams: P) => {
    if (!lastPage || lastPage.length === 0) {
      return undefined;
    }
    lastPageParams.page += 1;
    return lastPageParams;
  };

  const getPreviousPageParam = (
    lastPage: T[],
    pages: T[][],
    lastPageParams: P,
  ) => {
    if (!lastPage || lastPage.length == 0 || lastPageParams.page <= 0) {
      return undefined;
    }
    lastPageParams.page -= 1;
    return lastPageParams;
  };

  const { name, authorId, sort, tags } = PaginationSearchQuery;

  return useInfiniteQuery({
    queryKey: [...queryKey, name, authorId, sort, tags],
    initialPageParam: params,
    // @ts-ignore
    queryFn: (context) => getFunc(axios, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
    enabled,
  });
}

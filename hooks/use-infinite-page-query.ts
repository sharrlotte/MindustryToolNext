import useClient from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { PageableSearchQuery } from '@/types/data/pageable-search-schema';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export default function useInfinitePageQuery<T>(
  getFunc: (axios: AxiosInstance, params: PageableSearchQuery) => Promise<T[]>,
  ...queryKey: any
) {
  const PageableSearchQuery = useSearchPageParams();
  const { axiosClient, enabled } = useClient();

  const getNextPageParam = (
    lastPage: T[],
    pages: T[][],
    lastPageParams: PageableSearchQuery,
  ) => {
    if (!lastPage || lastPage.length === 0) {
      return undefined;
    }
    lastPageParams.page += 1;
    return lastPageParams;
  };

  const getPreviousPageParam = (
    lastPage: T[],
    pages: T[][],
    lastPageParams: PageableSearchQuery,
  ) => {
    if (!lastPage || lastPage.length == 0 || lastPageParams.page <= 0) {
      return undefined;
    }
    lastPageParams.page -= 1;
    return lastPageParams;
  };

  const { name, authorId, sort, tags } = PageableSearchQuery;

  return useInfiniteQuery({
    queryKey: [...queryKey, name, authorId, sort, tags],
    initialPageParam: PageableSearchQuery,
    queryFn: (context) => getFunc(axiosClient, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
    enabled,
  });
}

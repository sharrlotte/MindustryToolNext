import useClient from '@/hooks/use-client';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { SearchParams } from '@/types/data/search-schema';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export default function useInfinitePageQuery<T>(
  getFunc: (axios: AxiosInstance, params: SearchParams) => Promise<T[]>,
  ...queryKey: any
) {
  const searchParams = useSearchPageParams();
  const axiosClient = useClient();

  const getNextPageParam = (
    lastPage: T[],
    pages: T[][],
    lastPageParams: SearchParams,
  ) => {
    if (lastPage.length == 0) {
      return undefined;
    }
    lastPageParams.page += 1;
    return lastPageParams;
  };

  const getPreviousPageParam = (
    lastPage: T[],
    pages: T[][],
    lastPageParams: SearchParams,
  ) => {
    if (lastPage.length == 0 || lastPageParams.page <= 0) {
      return undefined;
    }
    lastPageParams.page -= 1;
    return lastPageParams;
  };

  return useInfiniteQuery({
    queryKey: [...queryKey, searchParams],
    initialPageParam: searchParams,
    queryFn: (context) => getFunc(axiosClient, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
  });
}

import useClientAPI from '@/hooks/use-client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';

export default function useInfinitePageQuery<T, P extends PaginationQuery>(
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>,
  params: P,
  queryKey: QueryKey[],
) {
  const { axios, enabled } = useClientAPI();

  const getNextPageParam = (lastPage: T[], pages: T[][], lastPageParams: P) => {
    console.log({ lastPage, lastPageParams, page });

    if (!lastPage || lastPage.length === 0 || lastPage.length < params.items) {
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
    if (
      !lastPage ||
      lastPageParams.page <= 0 ||
      lastPage.length === 0 ||
      lastPage.length < params.items
    ) {
      return undefined;
    }
    lastPageParams.page -= 1;
    return lastPageParams;
  };

  const { page, items, ...rest } = params;

  return useInfiniteQuery<T[], Error, InfiniteData<T[], P>, QueryKey[], P>({
    queryKey: [...queryKey, ...Object.values(rest)],
    initialPageParam: params,
    // @ts-ignore
    queryFn: (context) => getFunc(axios, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
    enabled,
  });
}

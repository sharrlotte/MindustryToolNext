import { AxiosInstance } from 'axios';

import useClientApi from '@/hooks/use-client';
import { PaginationQuery } from '@/types/data/pageable-search-schema';

import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';

export default function useInfinitePageQuery<T, P extends PaginationQuery>(
  getFunc: (axios: AxiosInstance, params: P) => Promise<T[]>,
  params: P,
  queryKey: QueryKey,
) {
  const axios = useClientApi();

  const getNextPageParam = (
    lastPage: T[],
    allPages: T[][],
    lastPageParams: P,
  ) => {
    if (lastPage.length === 0 || lastPage.length < params.size) {
      return undefined;
    }

    return { ...lastPageParams, page: allPages.length };
  };

  const getPreviousPageParam = (
    lastPage: T[],
    allPages: T[][],
    lastPageParams: P,
  ) => {
    if (
      lastPageParams.page <= 0 ||
      lastPage.length === 0 ||
      lastPage.length < params.size
    ) {
      return undefined;
    }

    return { ...lastPageParams, page: allPages.length - 1 };
  };

  // Remove page and size from key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, size, ...rest } = params;

  let filteredQueryKey: any[];

  if (Object.keys(rest).length > 0) {
    filteredQueryKey = [...queryKey, rest];
  } else {
    filteredQueryKey = [...queryKey];
  }

  return useInfiniteQuery<T[], Error, InfiniteData<T[], P>, QueryKey, P>({
    queryKey: filteredQueryKey,
    initialPageParam: params,
    // @ts-expect-error idk
    queryFn: (context) => getFunc(axios, context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
  });
}

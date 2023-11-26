import useSearchPageParams from "@/hooks/use-search-page-params";
import { SearchParams, searchSchema } from "@/schema/search-schema";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useInfinitePageQuery<T>(
  getFunc: (params: SearchParams) => Promise<T[]>,
  ...queryKey: any
) {
  const searchParams = useSearchPageParams();

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
    queryFn: (context) => getFunc(context.pageParam),
    getNextPageParam,
    getPreviousPageParam,
  });
}

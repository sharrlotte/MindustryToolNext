import { useCallback } from 'react';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const invalidateByKey = useCallback((...queryKeys: QueryKey[]) => queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey, exact: false })), [queryClient]);
  const updateById = useCallback(
    <T extends { id: string }>(queryKey: QueryKey, id: string, updater: (data: T) => T) =>
      queryClient.setQueriesData({ queryKey }, (prev: InfiniteData<T[]> | undefined) => {
        if (!prev) return undefined;

        if (typeof prev !== 'object' || !('pages' in prev)) {
          return prev;
        }

        return {
          pageParams: prev.pageParams,
          pages: prev.pages.map((items) => items.map((item) => (item.id === id ? updater(item) : item))),
        };
      }),
    [queryClient],
  );
  const filterByKey = useCallback(
    <T>(queryKey: QueryKey, updater: (data: T) => boolean) =>
      queryClient.setQueriesData({ queryKey }, (prev: InfiniteData<T[]> | undefined) => {
        if (!prev) return undefined;

        if (typeof prev !== 'object' || !('pages' in prev)) {
          return prev;
        }

        return {
          pageParams: prev.pageParams,
          pages: prev.pages.map((items) => items.filter(updater)),
        };
      }),
    [queryClient],
  );

  return {
    updateById,
    filterByKey,
    invalidateByKey,
  };
}

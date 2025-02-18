import { useCallback } from 'react';

import { InfiniteData, QueryKey, useQueryClient } from '@tanstack/react-query';

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const invalidateByKey = useCallback(
    (queryKeys: QueryKey) =>
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({
          predicate: (config) => config.queryKey.includes(queryKey),
        }),
      ),
    [queryClient],
  );
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

  const pushByKey = useCallback(
    <T>(queryKey: QueryKey, data: T) =>
      queryClient.setQueriesData({ queryKey }, (prev: InfiniteData<T[]> | undefined) => {
        if (!prev) return { pageParams: [], pages: [[data]] };

        if (typeof prev !== 'object' || !('pages' in prev)) {
          return prev;
        }

        if (!Array.isArray(prev.pages)) {
          return prev;
        }

        if (prev.pages.length === 0) {
          return prev;
        }

        prev.pages[0].push(data);

        return {
          pageParams: prev.pageParams,
          pages: [...prev.pages],
        };
      }),
    [queryClient],
  );

  return {
    pushByKey,
    updateById,
    filterByKey,
    invalidateByKey,
  };
}

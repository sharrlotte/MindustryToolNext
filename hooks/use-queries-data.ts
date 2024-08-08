import { QueryClient, QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

function _deleteById(queryClient: QueryClient, queryKey: QueryKey, id: string) {
  queryClient.setQueriesData<{ pages: any[][] }>(
    { predicate: (q) => queryKey.some((key) => q.queryKey.includes(key)) },
    (data) => {
      if (data) {
        data.pages = data.pages.map((page) =>
          page.filter((item) => item.id !== id),
        );

        return data;
      }
    },
  );
}

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const deleteById = useCallback(
    (queryKey: QueryKey, id: string) => _deleteById(queryClient, queryKey, id),
    [queryClient],
  );

  const invalidateByKey = useCallback(
    (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );

  return {
    deleteById,
    invalidateByKey,
  };
}

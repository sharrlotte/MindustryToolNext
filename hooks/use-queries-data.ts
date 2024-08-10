import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const invalidateByKey = useCallback(
    (...queryKeys: QueryKey[]) =>
      queryKeys.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    [queryClient],
  );

  return {
    invalidateByKey,
  };
}

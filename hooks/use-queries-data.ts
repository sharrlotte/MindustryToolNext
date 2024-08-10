import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const invalidateByKey = useCallback(
    (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );

  return {
    invalidateByKey,
  };
}

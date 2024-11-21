import { useCallback } from 'react';

import { QueryKey, useQueryClient } from '@tanstack/react-query';

export default function useQueriesData() {
  const queryClient = useQueryClient();

  const invalidateByKey = useCallback((...queryKeys: QueryKey[]) => queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey, exact: false })), [queryClient]);

  return {
    invalidateByKey,
  };
}

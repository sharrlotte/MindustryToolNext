'use client';

import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { QueryClientConfig } from '@tanstack/react-query';

export const persister = experimental_createPersister({
  storage: typeof window === 'undefined' ? null : localStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
  filters: {
    queryKey: ['users', 'tag-search'],
  },
}) as any;

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      persister,
    },
  },
};

export default queryClientConfig;

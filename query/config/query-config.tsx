import { experimental_createPersister } from '@tanstack/query-persist-client-core';
import { QueryClientConfig } from '@tanstack/react-query';

export const persister = experimental_createPersister({
  storage: localStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
}) as any;

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
};

export default queryClientConfig;

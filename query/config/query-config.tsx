import { QueryClientConfig } from '@tanstack/react-query';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 1000 * 60 * 5,
    },
  },
};

export default queryClientConfig;

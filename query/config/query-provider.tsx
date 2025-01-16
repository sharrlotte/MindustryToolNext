'use client';

import { HTMLAttributes, useState } from 'react';

import queryClientConfig from '@/query/config/query-config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }: HTMLAttributes<HTMLDivElement>) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

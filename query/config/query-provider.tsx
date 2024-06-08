'use client';

import queryClientConfig from '@/query/config/query-config';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HTMLAttributes, useState } from 'react';

export default function QueryProvider({
  children,
}: HTMLAttributes<HTMLDivElement>) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

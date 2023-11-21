'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HTMLAttributes, useState } from 'react';

export default function QueryProvider({ children }: HTMLAttributes<HTMLDivElement>) {
	const [queryClient] = useState(() => new QueryClient());

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

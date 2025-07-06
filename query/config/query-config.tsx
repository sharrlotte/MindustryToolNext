'use client';

import { QueryClientConfig } from '@tanstack/react-query';

const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			retry: 5,
			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 60 * 24,
		},
	},
};

export default queryClientConfig;

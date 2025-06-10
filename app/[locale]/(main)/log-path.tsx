'use client';

import { NotificationNumber } from '@/components/common/notification-number';

import useClientApi from '@/hooks/use-client';
import { getError } from '@/query/api';

import { useQuery } from '@tanstack/react-query';

export function LogPathIcon({ children }: { children: React.ReactNode }) {
	const axios = useClientApi();
	const { data } = useQuery({
		queryFn: () =>
			getError(axios, {
				page: 0,
				size: 100,
				status: ['INSPECTING', 'PENDING'],
			}),
		queryKey: ['errors'],
	});

	const total = data?.length ?? 0;

	return <NotificationNumber number={total}>{children}</NotificationNumber>;
}

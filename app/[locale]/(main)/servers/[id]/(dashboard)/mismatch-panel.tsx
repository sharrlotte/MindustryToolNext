'use client';

import ErrorMessage from '@/components/common/error-message';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import { getServerMismatch } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function MismatchPanel() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'mismatch'],
		queryFn: () => getServerMismatch(axios, id),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (isLoading) {
		return null;
	}

	if (!data || data.length === 0) {
		return null;
	}

	return (
		<section className="flex gap-2 flex-wrap">
			{data.map((mismatch) => (
				<div key={mismatch}>{mismatch}</div>
			))}
		</section>
	);
}

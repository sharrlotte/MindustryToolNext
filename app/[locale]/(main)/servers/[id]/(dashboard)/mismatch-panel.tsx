'use client';

import ErrorMessage from '@/components/common/error-message';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
		<Popover>
			<PopoverTrigger asChild>
				<span className="text-sm text-destructive-foreground">
					<span>{data[0]}</span>
					{data.length > 1 && (
						<span className="inline-flex size-4 min-w-4 rounded-md bg-destructive-foreground">{data.length - 1}+</span>
					)}
				</span>
			</PopoverTrigger>
			<PopoverContent>
				<section className="flex gap-2 text-sm w-full overflow-hidden text-ellipsis flex-col max-h-[50vh] overflow-y-auto">
					{data.map((mismatch) => (
						<div className="border rounded-full border-destructive-foreground text-ellipsis" key={mismatch}>
							{mismatch}
						</div>
					))}
				</section>
			</PopoverContent>
		</Popover>
	);
}

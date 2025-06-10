'use client';

import { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import JsonDisplay from '@/components/common/json-display';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Divider from '@/components/ui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ErrorStatus, errorStatus } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { getError, updateErrorStatus } from '@/query/api';
import { ErrorReport } from '@/types/response/ErrorReport';
import { PaginationQuerySchema } from '@/types/schema/search-query';

import { PopoverClose } from '@radix-ui/react-popover';
import { useMutation } from '@tanstack/react-query';

export default function ErrorLog() {
	const [status, setStatus] = useState<ErrorStatus[]>(['PENDING', 'INSPECTING']);
	return (
		<div className="flex flex-col h-full w-full overflow-hidden p-2 gap-2">
			<section className="flex divide-x border w-fit rounded-md">
				{errorStatus.map((t) => (
					<button
						key={t}
						className={cn('px-2 py-1 cursor-pointer capitalize h-9 min-h-9', {
							[statusColor[t]]: status.includes(t),
						})}
						onClick={() => (status.includes(t) ? setStatus(status.filter((s) => s !== t)) : setStatus([...status, t]))}
					>
						{t.toLowerCase()}
					</button>
				))}
			</section>
			<Divider />
			<ScrollContainer>
				<InfinitePage
					className="flex flex-col gap-2"
					queryKey={['errors', status]}
					params={{ status }}
					paramSchema={PaginationQuerySchema}
					queryFn={getError}
				>
					{(data) => data.map((error) => <ErrorCard key={error.id} error={error} />)}
				</InfinitePage>
			</ScrollContainer>
		</div>
	);
}

const statusColor: Record<ErrorStatus, string> = {
	PENDING: 'bg-cyan-600 border-cyan-600',
	RESOLVED: 'bg-green-600 border-green-600',
	FEATURE: 'bg-purple-600 border-purple-600',
	INSPECTING: 'bg-yellow-600 border-yellow-600',
};

function ErrorCard({ error: { id, content, createdAt, status } }: { error: ErrorReport }) {
	return (
		<div className="flex gap-2 flex-col p-4 rounded-md border">
			<div className="flex gap-1 items-center">
				<StatusBadge id={id} status={status} />
			</div>
			<div className="text-sm">
				<JsonDisplay json={content} />
			</div>
			<div className="flex gap-1 flex-col">
				<RelativeTime className="ml-auto text-sm text-muted-foreground" date={new Date(createdAt)} />
			</div>
		</div>
	);
}

function StatusBadge({ id, status }: { id: string; status: ErrorStatus }) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();
	const { mutate, isPending } = useMutation({
		mutationFn: (t: ErrorStatus) => updateErrorStatus(axios, id, t),
		onSuccess: () => invalidateByKey(['errors']),
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className={cn('rounded-full w-fit px-2.5 py-0.5 text-xs h-fit', statusColor[status])}>
					{status.toLowerCase()}
				</button>
			</PopoverTrigger>
			<PopoverContent className="bg-card p-2 gap-2 flex flex-col">
				{errorStatus
					.filter((t) => t !== status)
					.map((t) => (
						<PopoverClose asChild key={t}>
							<button
								disabled={isPending}
								className={cn('px-2.5 py-1 h-fit rounded-md cursor-pointer', statusColor[t])}
								onClick={() => mutate(t)}
							>
								{t.toLowerCase()}
							</button>
						</PopoverClose>
					))}
			</PopoverContent>
		</Popover>
	);
}

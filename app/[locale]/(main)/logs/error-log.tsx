'use client';

import { useState } from 'react';

import InfinitePage from '@/components/common/infinite-page';
import { RelativeTime } from '@/components/common/relative-time';
import ScrollContainer from '@/components/common/scroll-container';
import Divider from '@/components/ui/divider';

import { ErrorStatus, errorStatus } from '@/constant/constant';
import { cn } from '@/lib/utils';
import { getError } from '@/query/api';
import { ErrorReport } from '@/types/response/ErrorReport';
import { PaginationQuerySchema } from '@/types/schema/search-query';

export default function ErrorLog() {
	const [status, setStatus] = useState<ErrorStatus[]>(['PENDING', 'INSPECTING']);
	return (
		<div className="flex flex-col h-full w-full overflow-hidden p-2 gap-2">
			<section className="flex overflow-x-auto divide-x border w-fit rounded-md">
				{errorStatus.map((t) => (
					<button
						key={t}
						className={cn('px-2 py-1 cursor-pointer capitalize', {
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

function ErrorCard({ error: { content, createdAt, status } }: { error: ErrorReport }) {
	return (
		<div className="p-2 rounded-md border">
			<div className="flex gap-2">
				<p>{content}</p>
				<RelativeTime className="ml-auto text-sm" date={new Date(createdAt)} />
			</div>
			<span className={cn('rounded-full px-2.5 py-0.5 text-xs', statusColor[status])}>{status.toLowerCase()}</span>
		</div>
	);
}

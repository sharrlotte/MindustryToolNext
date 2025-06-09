'use client';

import dynamic from 'next/dynamic';

import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import { getServerMismatch } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

const ShutdownServerButton = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/(dashboard)/shutdown-server-button'), {
	ssr: false,
});

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
				<div className="text-sm text-destructive-foreground overflow-hidden text-ellipsis">
					<p>{data[0]}</p>
					{data.length > 1 && (
						<p className="inline-flex min-w-4 bg-destructive-foreground text-white p-0.5 text-xs rounded-full">
							{data.length - 1}+
						</p>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<section className="flex mt-2 gap-2 text-sm w-full overflow-hidden flex-col max-h-[50vh] overflow-y-auto p-2">
					<Tran text="server.restart-required" />
					<ShutdownServerButton id={id} />
					<Divider />
					{data.map((mismatch) => (
						<p className="rounded-md text-destructive-foreground p-2 bg-destructive text-wrap wrap break-words" key={mismatch}>
							{mismatch}
						</p>
					))}
				</section>
			</PopoverContent>
		</Popover>
	);
}

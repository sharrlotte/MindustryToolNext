'use client';

import RemoveServerButton from '@/app/[locale]/(main)/servers/[id]/(dashboard)/remove-server-button';
import ErrorMessage from '@/components/common/error-message';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useServerStatus from '@/hooks/use-server-status';
import { getServerMismatch } from '@/query/server';

import { useQuery } from '@tanstack/react-query';

export default function MismatchPanel() {
	const id = usePathId();
	const status = useServerStatus(id);
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'mismatch'],
		queryFn: () => getServerMismatch(axios, id),
		enabled: status === 'AVAILABLE',
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
						<p className="inline-flex size-4 min-w-4 rounded-md bg-destructive-foreground">{data.length - 1}+</p>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<section className="flex mt-2 gap-2 text-sm w-full overflow-hidden flex-col max-h-[50vh] overflow-y-auto">
					<Tran text="server.restart-required" />
					<RemoveServerButton id={id} />
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

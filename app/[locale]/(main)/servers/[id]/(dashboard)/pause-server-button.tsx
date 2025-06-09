'use client';

import { PauseIcon, PlayIcon } from 'lucide-react';
import React from 'react';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/common';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useServer from '@/hooks/use-server';
import { pauseServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
	id: string;
};

export default function PauseServerButton({ id }: Props) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();
	const { data: server } = useServer(id);
	const isPaused = server?.isPaused ?? false;

	const { mutate, isPending } = useMutation({
		mutationKey: ['server'],
		mutationFn: async () => pauseServer(axios, id),
		onError: (error, _variable, id) => toast.error(<Tran text="server.pause-fail" />, { error, id }),
		onSettled: () => {
			revalidate({ path: '/servers' });
			invalidateByKey(['server']);
		},
	});

	return (
		<Button className="min-w-20 border-none" title="Pause" variant="secondary" disabled={isPending} onClick={() => mutate()}>
			{isPaused ? (
				<>
					<PlayIcon className="size-4 stoke-1" />
					<Tran text="server.resume" />
				</>
			) : (
				<>
					<PauseIcon className="size-4 stoke-1" />
					<Tran text="server.pause" />
				</>
			)}
		</Button>
	);
}

'use client';

import React from 'react';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/common';
import useClientApi from '@/hooks/use-client';
import { stopServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
	id: string;
};

export default function StopServerButton({ id }: Props) {
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationKey: ['servers'],
		mutationFn: async () => stopServer(axios, id),
		onMutate: () => toast.loading(<Tran text="server.stopping" />),
		onSuccess: (_data, _variable, id) => toast.success(<Tran text="server.stop-success" />, { id }),
		onError: (error, _variable, id) => toast.error(<Tran text="server.stop-fail" />, { error, id }),
		onSettled: () => revalidate({ path: '/servers' }),
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="min-w-20" title="shutdown" variant="secondary" disabled={isPending}>
					<Tran text="server.stop" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>
					<Tran text="server.stop-confirm" />
				</AlertDialogTitle>
				<Hidden>
					<AlertDialogDescription></AlertDialogDescription>
				</Hidden>
				<AlertDialogFooter>
					<AlertDialogCancel>
						<Tran text="cancel" />
					</AlertDialogCancel>
					<AlertDialogAction variant="destructive" asChild>
						<Button title="Shutdown" disabled={isPending} onClick={() => mutate()}>
							<Tran text="server.stop" />
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

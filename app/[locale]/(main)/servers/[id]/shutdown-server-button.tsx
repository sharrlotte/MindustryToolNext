'use client';

import React from 'react';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/common';
import useClientApi from '@/hooks/use-client';
import { shutdownServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
	id: string;
};

export default function ShutdownServerButton({ id }: Props) {
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationKey: ['servers'],
		mutationFn: async () =>
			toast.promise(shutdownServer(axios, id), {
				loading: <Tran text="server.shutting-down" />,
				success: <Tran text="server.shutdown-success" />,
				error: (error) => ({ title: <Tran text="server.shutdown-fail" />, description: error?.message }),
			}),
		onSettled: () => {
			revalidate({ path: '/servers' });
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className="min-w-20" title="Delete" variant="destructive" disabled={isPending}>
					<Tran text="server.shutdown" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>
					<Tran text="server.shutdown-confirm" />
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
							<Tran text="server.shutdown" />
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

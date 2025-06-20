'use client';

import { PowerIcon } from 'lucide-react';
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

import { revalidate } from '@/action/server-action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { removeServer } from '@/query/server';

import { useMutation } from '@tanstack/react-query';

type Props = {
	id: string;
};

export default function ShutdownServerButton({ id }: Props) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();

	const { mutate, isPending } = useMutation({
		mutationKey: ['server'],
		mutationFn: async () => removeServer(axios, id),
		onMutate: () => toast.loading(<Tran text="server.shutting-down" />),
		onSuccess: (_data, _variable, id) => toast.success(<Tran text="server.shutdown-success" />, { id }),
		onError: (error, _variable, id) => toast.error(<Tran text="server.shutdown-fail" />, { error, id }),
		onSettled: () => {
			revalidate({ path: '/servers' });
			invalidateByKey(['server']);
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					className="min-w-20 text-foreground bg-destructive-foreground"
					title="Delete"
					variant="destructive"
					disabled={isPending}
				>
					<PowerIcon className="size-4" />
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

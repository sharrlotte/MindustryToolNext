'use client';

import { BanIcon } from 'lucide-react';

import Tran from '@/components/common/tran';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { revalidate } from '@/action/server-action';
import { useSocket } from '@/context/socket.context';
import useMessage from '@/hooks/use-message';

import { useQueryClient } from '@tanstack/react-query';

type BanButtonProps = {
	id: string;
	ip?: string;
	uuid?: string;
	username?: string;
};

export function BanButton({ id, ip, uuid, username }: BanButtonProps) {
	const { state } = useSocket();
	const { sendMessage } = useMessage({
		room: `SERVER_CONSOLE-${id}`,
		method: 'MESSAGE',
	});

	const queryClient = useQueryClient();

	function handleBan() {
		if (ip) {
			sendMessage(`/ban add ip ${ip}`);
		}

		if (uuid) {
			sendMessage(`/ban add id ${uuid}`);
		}

		if (username) {
			sendMessage(`/ban add name ${username}`);
		}

		setTimeout(() => {
			revalidate({
				path: '/[locale]/(main)/servers/[id]/(dashboard)',
			});
			queryClient.invalidateQueries({
				queryKey: ['server', id, 'player'],
			});
		}, 1000);
	}

	if (state !== 'connected') {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="command-destructive">
					<BanIcon size={20} />
					<Tran text="ban" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>
					<Tran text="ban" />
				</AlertDialogTitle>
				<AlertDialogCancel>
					<Tran text="cancel" />
				</AlertDialogCancel>
				<AlertDialogAction asChild>
					<Button variant="command-destructive" onClick={handleBan}>
						<Tran text="ban" />
					</Button>
				</AlertDialogAction>
			</AlertDialogContent>
		</AlertDialog>
	);
}

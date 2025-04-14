'use client';
import { BanIcon } from 'lucide-react';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';
import { DialogTitle } from '@/components/ui/dialog';

type BanButtonProps = {
	id: string;
	ip?: string;
	uuid?: string;
	username?: string;
};

export function BanButton({ id, ip, uuid, username }: BanButtonProps) {
	const { state } = useSocket();
	const { sendMessage } = useMessage({
		room: `SERVER-${id}`,
		method: 'MESSAGE',
	});

	function handleBan() {
		if (ip) {
			sendMessage(`/ban ip ${ip}`);
		}

		if (uuid) {
			sendMessage(`/ban id ${uuid}`);
		}

		if (username) {
			sendMessage(`/ban name ${username}`);
		}
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
				<DialogTitle>
					<Tran text="ban" />
				</DialogTitle>
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

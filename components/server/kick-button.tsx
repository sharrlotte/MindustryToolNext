'use client';

import { BanIcon } from 'lucide-react';

import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { useSocket } from '@/context/socket-context';
import useMessage from '@/hooks/use-message';

type BanButtonProps = {
	id: string;
	username: string;
};

export function KickButton({ id, username }: BanButtonProps) {
	const { state } = useSocket();
	const { sendMessage } = useMessage({
		room: `SERVER-${id}`,
		method: 'MESSAGE',
	});

	function handleKick() {
		sendMessage(`/kick ${username}`);
	}

	if (state !== 'connected') {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="command-destructive">
					<BanIcon size={20} />
					<Tran text="kick" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogCancel>
					<Tran text="cancel" />
				</AlertDialogCancel>
				<AlertDialogAction asChild>
					<Button variant="command-destructive" onClick={handleKick}>
						<Tran text="kick" />
					</Button>
				</AlertDialogAction>
			</AlertDialogContent>
		</AlertDialog>
	);
}

'use client';

import { BanIcon } from 'lucide-react';
import { useState } from 'react';



import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



import { revalidate } from '@/action/common';
import { useSocket } from '@/context/socket.context';
import useMessage from '@/hooks/use-message';



import { useQueryClient } from '@tanstack/react-query';


type BanButtonProps = {
	id: string;
	uuid: string;
};

export function KickButton({ id, uuid }: BanButtonProps) {
	const { state } = useSocket();
	const [reason, setReason] = useState('');
	const { sendMessage } = useMessage({
		room: `SERVER-${id}`,
		method: 'MESSAGE',
	});

	const queryClient = useQueryClient();

	function handleKick() {
		sendMessage(`/kickWithReason ${uuid} ${reason}`);

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
					<Tran text="kick" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>
					<Tran text="kick" />
				</AlertDialogTitle>
				<Label>
					<Tran text="server.kick-reason" />
				</Label>
				<Input className="w-full" value={reason} onChange={(event) => setReason(event.currentTarget.value)} />
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

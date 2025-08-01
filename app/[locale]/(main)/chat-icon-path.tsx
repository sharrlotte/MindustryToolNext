'use client';

import { MessageCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { useSocket } from '@/context/socket.context';
import useClientApi from '@/hooks/use-client';
import useNotification from '@/hooks/use-notification';
import { isError } from '@/lib/error';
import { cn } from '@/lib/utils';
import { getLastMessage } from '@/query/message';
import { SocketResult } from '@/types/data/SocketClient';

export function MessageCircleIconPath() {
	const { socket } = useSocket();
	const axios = useClientApi();
	const { postNotification } = useNotification();
	const [hasNewMessage, setHasNewMessage] = useState(false);
	const [lastMessage] = useLocalStorage('LAST_MESSAGE_GLOBAL', '');

	useEffect(() => {
		try {
			getLastMessage(axios, 'GLOBAL') //
				.then((newestMessage) => {
					if (isError(newestMessage)) {
						return;
					}

					setHasNewMessage(newestMessage && newestMessage.id !== lastMessage);
				});
		} catch (e) {
			// ignored
		}

		const globalMessageHandler = (message: SocketResult<'MESSAGE'>) => {
			if (message instanceof Error) {
				return;
			}

			postNotification(message.content, message.userId);
		};

		socket.onRoom('GLOBAL').onMessage('MESSAGE', globalMessageHandler);

		return () => {
			socket.onRoom('GLOBAL').remove('MESSAGE', globalMessageHandler);
		};
	}, [socket, postNotification, lastMessage, axios]);

	return (
		<div className="relative">
			<MessageCircleIcon />
			<span
				className={cn('absolute -right-2 -top-2 hidden h-3 w-3 animate-ping rounded-full bg-red-500 opacity-75', {
					'inline-flex': hasNewMessage,
				})}
			/>
			<span
				className={cn('absolute -right-2 -top-2 hidden h-3 w-3 rounded-full bg-red-500 opacity-75', {
					'inline-flex ': hasNewMessage,
				})}
			/>
		</div>
	);
}

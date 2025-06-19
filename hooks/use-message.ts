import { useCallback } from 'react';

import { useSocket } from '@/context/socket.context';

type Props = {
	room: string;
	method?: 'MESSAGE';
};

export default function useMessage({ room, method = 'MESSAGE' }: Props) {
	const { socket } = useSocket();

	const sendMessage = useCallback(
		(message: string) => {
			if (socket.getState() === 'connected') {
				return socket.onRoom(room).send({ data: message, method });
			} else {
				throw new Error('Socket is not connected');
			}
		},
		[method, room, socket],
	);

	return { sendMessage };
}

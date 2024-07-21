import { useCallback } from 'react';

import { useSocket } from '@/context/socket-context';

type Props = {
  room: string;
};

export default function useMessage({ room }: Props) {
  const { socket, state } = useSocket();

  const sendMessage = useCallback(
    (message: string) => {
      if (state === 'connected') {
        return socket.onRoom(room).send({ data: message, method: 'MESSAGE' });
      } else throw new Error('Socket is not connected');
    },
    [room, socket, state],
  );

  return { sendMessage };
}

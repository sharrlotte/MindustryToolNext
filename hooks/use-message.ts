import { useCallback } from 'react';

import { useSocket } from '@/context/socket-context';

type Props = {
  room: string;
  method?: 'SERVER_MESSAGE';
};

export default function useMessage({ room, method }: Props) {
  const { socket, state } = useSocket();

  const sendMessage = useCallback(
    (message: string) => {
      if (state === 'connected') {
        return socket.onRoom(room).send({ data: message, method: method || 'MESSAGE' });
      } else throw new Error('Socket is not connected');
    },
    [method, room, socket, state],
  );

  return { sendMessage };
}

import { useCallback, useEffect } from 'react';

import { useSocket } from '@/context/socket-context';

type Props = {
  room: string;
};

export default function useMessage({ room }: Props) {
  const { socket, state } = useSocket();

  const sendMessage = useCallback(
    (message: string) => {
      if (socket && state === 'connected') {
        socket.onRoom(room).send({ data: message, method: 'MESSAGE' });
      }
    },
    [room, socket, state],
  );

  return { sendMessage };
}

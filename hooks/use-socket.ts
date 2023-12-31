import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const hasToken = useRef(false);
  const socket = useRef<SocketClient | undefined>();
  const { data: session, status } = useSession();

  const accessToken = session?.user?.accessToken;
  useEffect(() => {
    if (hasToken.current || status === 'loading') {
      return;
    }

    let newSocket: SocketClient;

    if (accessToken) {
      hasToken.current = true;
      newSocket = new SocketClient(
        `${env.url.socket}/socket?accessToken=${accessToken}`,
      );
    } else {
      newSocket = new SocketClient(`${env.url.socket}/socket`);
    }

    newSocket.error = (err) => {
      console.log(err);
    };

    if (socket.current) {
      socket.current.close();
    }

    socket.current = newSocket;

    return () => {
      hasToken.current = false;
      newSocket.close();
    };
  }, [accessToken, status]);

  return {
    socket: socket.current,
    state: socket.current?.getState() ?? 'disconnected',
  };
}

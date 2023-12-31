import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const hasToken = useRef(false);
  const [socket, setSocket] = useState<SocketClient | undefined>();
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

    newSocket.close = () => {
      hasToken.current = false;
    };

    setSocket((prev) => {
      if (prev) {
        prev.close();
      }
      return newSocket;
    });

    return () => {
      newSocket.send({ method: 'DISCONNECT' });
      newSocket.close();
    };
  }, [accessToken, status]);

  return { socket: socket, state: socket?.getState() ?? 'disconnected' };
}

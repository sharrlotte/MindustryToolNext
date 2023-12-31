import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const { data: session } = useSession();

  const accessToken = session?.user?.accessToken;
  useEffect(() => {
    let newSocket: SocketClient;
    if (accessToken) {
      newSocket = new SocketClient(
        `${env.url.socket}/socket?accessToken=${accessToken}`,
      );
    } else {
      newSocket = new SocketClient(`${env.url.socket}/socket`);
    }

    newSocket.error = (err) => {
      console.log(err);
    };

    setSocket(newSocket);

    return () => {
      newSocket.send({ method: 'DISCONNECT' });
      newSocket.close();
    };
  }, [accessToken]);

  return { socket: socket, state: socket?.getState() ?? 'disconnected' };
}

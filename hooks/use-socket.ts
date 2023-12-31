import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const { data: session, status } = useSession();
  const toaster = useRef(useToast());

  const accessToken = session?.user?.accessToken;
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

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

    newSocket.connect = () =>
      toaster.current.toast({
        title: 'Connected to server',
      });

    newSocket.close = () =>
      toaster.current.toast({
        title: 'Disconnected to server',
      });

    setSocket((prev) => {
      if (prev) {
        prev.close();
      }
      return newSocket;
    });

    return () => {
      const interval = setInterval(() => {
        newSocket.send({ method: 'DISCONNECT' });
        newSocket.close();

        if (newSocket.getState() === 'disconnected') {
          clearInterval(interval);
        }
      }, 1000);
    };
  }, [accessToken, status]);

  return { socket: socket, state: socket?.getState() ?? 'disconnected' };
}

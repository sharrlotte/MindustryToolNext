import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import useSocketStore from '@/zustand/socket-store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const { socket, authState, setSocket, setAuthState } = useSocketStore();

  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    const instance = new SocketClient(`${env.url.socket}/socket`);
    setSocket(instance);
  }, []);

  useEffect(() => {
    if (
      authState !== 'loading' ||
      status === 'loading' ||
      !accessToken ||
      !socket ||
      socket.getState() !== 'connected'
    ) {
      return;
    }

    socket.send({
      method: 'AUTHORIZATION',
      data: accessToken,
    });

    setAuthState('authenticated');
  }, [accessToken, socket, status, authState, setAuthState]);

  useEffect(() => {
    return () => {
      setAuthState('loading');
    };
  }, []);

  return {
    socket: socket,
    state: socket?.getState() ?? 'disconnected',
  };
}

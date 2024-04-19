import env from '@/constant/env';
import { useSocketContext } from '@/context/socket-context';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
  isAuthenticated: boolean;
};

export default function useSocket(): UseSocket {
  const { socket, authState, setSocket, setAuthState } = useSocketContext();

  const [state, setState] = useState<SocketState>('connected');
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    const instance = new SocketClient(`${env.url.socket}/socket`);

    instance.onDisconnect(() => setAuthState('loading'));
    instance.onDisconnect(() => setState('disconnected'));
    instance.onConnect(() => setState('connected'));

    setSocket(instance);
  }, []);

  useEffect(() => {
    if (
      authState !== 'loading' ||
      status === 'loading' ||
      !accessToken ||
      !socket ||
      state !== 'connected'
    ) {
      return;
    }

    socket.send({
      method: 'AUTHORIZATION',
      data: accessToken,
    });

    setAuthState('authenticated');
  }, [accessToken, socket, status, state, authState, setAuthState]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return {
    socket,
    state,
    isAuthenticated: authState === 'authenticated',
  };
}

'use client';

import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const [socket, setSocket] = useState<SocketClient | undefined>();
  const [isAuthenticated, setAuthenticated] = useState(false);

  const { enabled } = useClientAPI();
  const [state, setState] = useState<SocketState>('disconnected');
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    if (!socket) {
      const instance = new SocketClient(`${env.url.socket}/socket`);
      instance.connect = () => setState('connected');
      instance.disconnect = () => setState('disconnected');
      setSocket(instance);
      return;
    }

    return () => {
      socket?.close();
    };
  }, [socket]);

  useEffect(() => {
    if (
      state !== 'connected' ||
      isAuthenticated ||
      !accessToken ||
      !enabled ||
      !socket
    ) {
      return;
    }

    socket.send({
      method: 'AUTHORIZATION',
      data: accessToken,
    });

    setAuthenticated(true);
  }, [accessToken, enabled, socket, state, isAuthenticated]);

  return {
    socket: socket,
    state: socket?.getState() ?? 'disconnected',
  };
}

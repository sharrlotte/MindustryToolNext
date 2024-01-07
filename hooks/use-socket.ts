'use client';

import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef } from 'react';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const socket = useRef<SocketClient | undefined>();
  const authenticated = useRef(false);

  const { enabled } = useClientAPI();
  const state = socket.current?.getState() ?? 'disconnected';
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const init = useCallback(() => {
    if (!socket.current) {
      socket.current = new SocketClient(`${env.url.socket}/socket`);
      return;
    }

    if (
      state !== 'connected' ||
      authenticated.current ||
      !accessToken ||
      !enabled
    ) {
      return;
    }

    socket.current.send({
      method: 'AUTHORIZATION',
      data: accessToken,
    });

    authenticated.current = true;
  }, [state, accessToken, enabled]);

  useEffect(() => init(), [init]);

  return {
    socket: socket.current,
    state: socket.current?.getState() ?? 'disconnected',
  };
}

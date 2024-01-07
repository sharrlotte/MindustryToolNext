'use client';

import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { Token } from '@/types/data/Token';
import { useCallback, useEffect, useRef } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

export default function useSocket(): UseSocket {
  const socket = useRef<SocketClient | undefined>();
  const authenticated = useRef(false);

  const { enabled } = useClientAPI();
  const state = socket.current?.getState() ?? 'disconnected';
  const token = useReadLocalStorage<Token>('token');

  const init = useCallback(() => {
    if (!socket.current) {
      socket.current = new SocketClient(`${env.url.socket}/socket`);
      return;
    }

    if (state !== 'connected' || authenticated.current || !token || !enabled) {
      return;
    }

    const { accessToken } = token;

    socket.current.send({
      method: 'AUTHORIZATION',
      data: accessToken,
    });

    authenticated.current = true;
  }, [state, token, enabled]);

  useEffect(() => init(), [init]);

  return {
    socket: socket.current,
    state: socket.current?.getState() ?? 'disconnected',
  };
}

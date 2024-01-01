'use client';

import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

type UseSocket = {
  socket: SocketClient | undefined;
  state: SocketState;
};

type UseSocketStoreType = {
  socket: SocketClient | undefined;
  setSocket: (socket: SocketClient) => void;
};

const useSocketStore = create<UseSocketStoreType>((set) => ({
  socket: undefined,
  setSocket: (socket) => {
    set((prev) => {
      if (prev.socket) {
        prev.socket.close();
      }

      return { socket: socket };
    });
  },
}));

export default function useSocket(): UseSocket {
  const { socket, setSocket } = useSocketStore();
  const { data: session, status } = useSession();

  const accessToken = session?.user?.accessToken;

  const init = useCallback(() => {
    if (status === 'loading') {
      return;
    }

    if (!socket) {
      setSocket(new SocketClient(`${env.url.socket}/socket`));
      return;
    }

    socket.connect = () => init();

    const state = socket.getState();

    if (state !== 'connected') {
      return;
    }

    if (accessToken) {
      socket.send({
        method: 'AUTHORIZATION',
        data: accessToken,
      });
    }
  }, [accessToken, status, socket, setSocket]);

  useEffect(() => init(), [init]);

  return {
    socket: socket,
    state: socket?.getState() ?? 'disconnected',
  };
}

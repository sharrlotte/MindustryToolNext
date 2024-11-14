'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useInterval } from 'usehooks-ts';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type SocketContextType = {
  socket?: SocketClient;
  state: SocketState;
};

type UseSocket = Omit<SocketContextType, 'socket'> & {
  socket: SocketClient;
};

const defaultContextValue: SocketContextType = {
  socket: undefined,
  state: 'disconnected',
};

export const SocketContext = React.createContext(defaultContextValue);

export function useSocket(): UseSocket {
  const context = React.useContext(SocketContext);
  const socket = context.socket;

  if (!socket) {
    throw new Error('Can not use out side of context');
  }

  return { ...context, socket };
}
export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<SocketClient>();
  const [state, setState] = useState<SocketState>('disconnected');

  useEffect(() => {
    const instance = new SocketClient(`${env.url.socket}/socket`);

    instance.onDisconnect(() => setState('disconnected'));
    instance.onConnect(() => setState('connected'));

    setSocket(instance);

    return () => instance.close();
  }, [setSocket]);

  useInterval(() => setState(socket?.getState() ?? 'disconnected'), 10000);

  return (
    <SocketContext.Provider
      value={{
        socket,
        state,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

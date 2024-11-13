'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type SocketContextType = {
  socket: SocketClient;
  state: SocketState;
};

type UseSocket = Omit<SocketContextType, 'socket'> & {
  socket: SocketClient;
};

const defaultContextValue: SocketContextType = {
  socket: new SocketClient(`${env.url.socket}/socket`),
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

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<SocketClient>(defaultContextValue.socket);
  const [state, setState] = useState<SocketState>('disconnected');

  useEffect(() => {
    socket.onDisconnect(() => setState('disconnected'));
    socket.onConnect(() => setState('connected'));

    return () => socket.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(socket?.getState() ?? 'disconnected');
    }, 10000);

    return () => clearInterval(interval);
  }, [socket]);

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

'use client';

import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';
import { useSession } from 'next-auth/react';
import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type SocketContextType = {
  socket?: SocketClient;
  state: SocketState;
  isAuthenticated: boolean;
};

type UseSocket = Omit<
  {
    socket?: SocketClient;
    state: SocketState;
    isAuthenticated: boolean;
  },
  'socket'
> & {
  socket: SocketClient;
};

const defaultContextValue: SocketContextType = {
  socket: undefined,
  state: 'disconnected',
  isAuthenticated: false,
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
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [state, setState] = useState<SocketState>('disconnected');
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  useLayoutEffect(() => {
    const instance = new SocketClient(`${env.url.socket}/socket`);

    instance.onDisconnect(() => setAuthState('loading'));
    instance.onDisconnect(() => setState('disconnected'));
    instance.onConnect(() => setState('connected'));

    setSocket(instance);
  }, [setAuthState, setSocket]);

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
  }, [socket]);

  if (!socket) {
    return <></>;
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        state,
        isAuthenticated: authState === 'authenticated',
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

'use client';

import SocketClient from '@/types/data/SocketClient';
import React, { ReactNode, useState } from 'react';

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

type SocketContextType = {
  socket?: SocketClient;
  setSocket: (socket?: SocketClient) => void;
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
};

const defaultContextValue: SocketContextType = {
  socket: undefined,
  setSocket: (socket?: SocketClient) => {},
  authState: 'loading',
  setAuthState: (state: AuthState) => {},
};

export const SocketContext = React.createContext(defaultContextValue);

export const useSocketContext = () => React.useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<SocketClient>();
  const [authState, setAuthState] = useState<AuthState>('loading');

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        authState,
        setAuthState,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

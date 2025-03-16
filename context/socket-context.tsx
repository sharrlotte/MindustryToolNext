'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import env from '@/constant/env';
import SocketClient, { SocketState } from '@/types/data/SocketClient';

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

  return { ...context, socket };
}
export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket] = useState<SocketClient>(defaultContextValue.socket);
  const [state, setState] = useState<SocketState>(defaultContextValue.socket.getState());

  useEffect(() => {
    socket.connect();
    socket.onDisconnect(() => setState('disconnected'));
    socket.onConnect(() => setState('connected'));
  }, [socket]);

  useInterval(() => setState(socket.getState()), 1000);

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

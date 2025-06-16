'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import { useSession } from '@/context/session.context';
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
	const { state: authState } = useSession();
	const isShowDisconnected = useRef(false);

	useEffect(() => {
		if (authState !== 'authenticated') return;

		if (socket.getState() !== 'connected') {
			socket.connect();
		}

		socket.onDisconnect(() => {
			setState('disconnected');

			if (!isShowDisconnected.current) {
				isShowDisconnected.current = true;
				toast('Disconnected', {
					description: 'You are disconnected from the server',
				});
			}
		});

		if (socket.getState() === 'connected') {
			setState('connected');
		}

		socket.onConnect(() => {
			setState('connected');
		});

		socket.onError(() => {
			setState(socket.getState());
		});
	}, [socket, authState]);

	useEffect(() => {
		return () => {
			socket.close();
		};
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

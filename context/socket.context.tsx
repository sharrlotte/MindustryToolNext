'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { toast } from '@/components/ui/sonner';

import SocketClient, { SocketState } from '@/types/data/SocketClient';

import env from '@/constant/env';
import { useSession } from '@/context/session.context';

type SocketContextType = {
	socket: SocketClient;
	state: SocketState;
};

type UseSocket = Omit<SocketContextType, 'socket'> & {
	socket: SocketClient;
};

const defaultContextValue: SocketContextType = {
	socket: new SocketClient(`${env.url.socket}/api/v3/socket`),
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

		if (socket.getState() === 'connected') {
			setState(socket.getState());
		}

		if (socket.getState() !== 'connected') {
			socket.connect();
		}

		socket.onDisconnect(() => {
			setState(socket.getState());

			if (!isShowDisconnected.current) {
				isShowDisconnected.current = true;
				toast('Disconnected', {
					description: 'You are disconnected from the server',
				});
			}
		});

		socket.onConnect(() => {
			setState(socket.getState());
		});

		socket.onError(() => {
			setState(socket.getState());
		});
	}, [socket, authState]);

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

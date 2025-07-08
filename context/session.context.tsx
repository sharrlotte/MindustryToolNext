'use client';

import React, { ReactNode, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { SessionSchema } from '@/types/response/Session';

import axiosInstance from '@/query/config/config';

import { errors, isError } from '@/lib/error';

import z from 'zod/v4';

export const SessionStateSchema = z.union([
	z.object({
		session: z.null(),
		state: z.literal('loading'),
	}),
	z.object({
		session: SessionSchema,
		state: z.literal('authenticated'),
	}),
	z.object({
		session: z.null(),
		state: z.literal('unauthenticated'),
	}),
]);

type SessionState = z.infer<typeof SessionStateSchema>;

const defaultContextValue: SessionState = {
	session: null,
	state: 'loading',
};

export const SessionContext = React.createContext<SessionState>(defaultContextValue);

export function useSession(): SessionState {
	const context = React.useContext(SessionContext);

	if (!context) {
		throw new Error('Can not use out side of context');
	}
	// TEST
	// const session = context.session;

	// if (session) {
	//   context.session = { ...session, roles: [] };
	// }

	return context;
}

export function useMe() {
	const { session } = useSession();

	if (!session || isError(session)) {
		return { highestRole: 0 };
	}

	const highestRole = session?.roles.sort((r1, r2) => r2?.position - r1?.position)[0]?.position || 0;

	return { highestRole };
}

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useLocalStorage<SessionState>('session', defaultContextValue, {
		deserializer: (value) => {
			try {
				return SessionStateSchema.parse(JSON.parse(value));
			} catch (e) {
				return defaultContextValue;
			}
		},
	});

	useEffect(() => {
		axiosInstance
			.get('/auth/session')
			.then((res) => res.data)
			.then((data) =>
				setSession(
					data ? { session: SessionSchema.parse(data), state: 'authenticated' } : { session: null, state: 'unauthenticated' },
				),
			)
			.catch((error) => {
				console.error('Fail to fetch session: ' + error);
				errors.push(error);
				setSession({
					session: null,
					state: 'unauthenticated',
				});
			});
	}, [setSession]);

	return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

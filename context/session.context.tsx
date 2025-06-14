'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { ApiError, isError } from '@/lib/error';
import axiosInstance from '@/query/config/config';
import { Session } from '@/types/response/Session';

type SessionState =
	| {
			session: null;
			state: 'loading' | 'unauthenticated';
	  }
	| {
			session: Session;
			state: 'authenticated';
	  }
	| {
			session: ApiError;
			state: 'unauthenticated';
	  };

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
	const [session, setSession] = useState<SessionState>(defaultContextValue);

	const fetch = useCallback(
		() =>
			axiosInstance
				.get('/auth/session')
				.then((r) => r.data)
				.then((data) =>
					setSession(data ? { session: data, state: 'authenticated' } : { session: null, state: 'unauthenticated' }),
				)
				.catch(() =>
					setSession({
						session: null,
						state: 'unauthenticated',
					}),
				),
		[],
	);

	useEffect(() => {
		fetch();
	}, [fetch]);

	return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

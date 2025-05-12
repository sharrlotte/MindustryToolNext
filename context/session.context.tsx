'use client';

import React, { ReactNode, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';

import {
	Config,
	DEFAULT_PAGINATION_SIZE,
	DEFAULT_PAGINATION_TYPE,
	PAGINATION_SIZE_PERSISTENT_KEY,
	PAGINATION_TYPE_PERSISTENT_KEY,
	SESSION_ID_PERSISTENT_KEY,
} from '@/constant/constant';
import { Locale, cookieName, defaultLocale } from '@/i18n/config';
import { ApiError, isError } from '@/lib/error';
import axiosInstance from '@/query/config/config';
import { Session } from '@/types/response/Session';

import { useQuery } from '@tanstack/react-query';

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
export type SessionContextType = SessionState & {
	createdAt: number;
	config: Config;
	setConfig: <T extends keyof Config>(config: T, value: Config[T]) => void;
};

const defaultContextValue: SessionContextType = {
	session: null,
	state: 'loading',
	createdAt: 0,
	config: {
		paginationType: DEFAULT_PAGINATION_TYPE,
		paginationSize: DEFAULT_PAGINATION_SIZE,
		Locale: defaultLocale,
	},
	setConfig: () => {},
};

export const SessionContext = React.createContext<SessionContextType>(defaultContextValue);

export function useSession(): SessionContextType {
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

export function SessionProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
	const [{ Locale, paginationSize, paginationType }, _setConfig] = useCookies([
		PAGINATION_TYPE_PERSISTENT_KEY,
		PAGINATION_SIZE_PERSISTENT_KEY,
		SESSION_ID_PERSISTENT_KEY,
		cookieName,
	]);

	const setConfig = useCallback(
		<T extends keyof Config>(name: T, value: Config[T]) => _setConfig(name, value, { path: '/' }),
		[_setConfig],
	);

	const { data, status, error } = useQuery({
		queryKey: ['session'],
		queryFn: () =>
			axiosInstance
				.get('/auth/session')
				.then((r) => r.data)
				.then((data) => data ?? null)
				.catch(() => null),
	});

	const session = useMemo(() => {
		const d: SessionState =
			status === 'error'
				? { session: { error }, state: 'unauthenticated' }
				: status === 'success'
					? { session: data, state: 'authenticated' }
					: { session: null, state: 'loading' };

		return {
			...d,
			createdAt: Date.now(),
			config: {
				paginationType: paginationType ?? DEFAULT_PAGINATION_TYPE,
				paginationSize: paginationSize ? Number(paginationSize) : DEFAULT_PAGINATION_SIZE,
				Locale: locale ?? Locale ?? defaultLocale,
			},
			setConfig: setConfig,
		};
	}, [Locale, data, error, locale, paginationSize, paginationType, setConfig, status]);

	return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

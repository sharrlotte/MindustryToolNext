'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';

import {
  Config,
  DEFAULT_PAGINATION_SIZE,
  DEFAULT_PAGINATION_TYPE,
  DEFAULT_SHOW_NAV,
  PAGINATION_SIZE_PERSISTENT_KEY,
  PAGINATION_TYPE_PERSISTENT_KEY,
  SHOW_NAV_PERSISTENT_KEY,
  ServerSessionContextType,
  SessionContextType,
} from '@/context/session-context.type';

const defaultContextValue: SessionContextType = {
  session: null,
  state: 'loading',
  createdAt: 0,
  config: {
    showNav: DEFAULT_SHOW_NAV,
    paginationType: DEFAULT_PAGINATION_TYPE,
    paginationSize: DEFAULT_PAGINATION_SIZE,
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

  if (!session) {
    return { highestRole: 0 };
  }

  const highestRole = session?.roles.sort((r1, r2) => r2?.position - r1?.position)[0]?.position || 0;

  return { highestRole };
}

export default function ClientSessionProvider({ session: init, children }: { session: ServerSessionContextType; children: ReactNode }) {
  const [{ paginationSize, paginationType, showNav }, _setConfig] = useCookies([PAGINATION_TYPE_PERSISTENT_KEY, SHOW_NAV_PERSISTENT_KEY, PAGINATION_SIZE_PERSISTENT_KEY]);

  const config = useMemo(
    () => ({
      paginationType: paginationType ?? DEFAULT_PAGINATION_TYPE,
      paginationSize: paginationSize ? Number(paginationSize) : DEFAULT_PAGINATION_SIZE,
      showNav: Boolean(showNav),
    }),
    [paginationSize, paginationType, showNav],
  );

  const setConfig = useCallback(<T extends keyof Config>(name: T, value: Config[T]) => _setConfig(name, value, { path: '/' }), [_setConfig]);
  const [session, setSession] = useState<SessionContextType>({ ...init, setConfig: setConfig });

  useEffect(() => {
    setSession((prev) => {
      if (JSON.stringify(config) === JSON.stringify(prev.config)) {
        return prev;
      }

      console.log(prev.config, config);

      return { ...prev, config };
    });
  }, [config]);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

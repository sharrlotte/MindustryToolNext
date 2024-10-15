'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import useClientApi from '@/hooks/use-client';
import { Session } from '@/types/response/Session';

export type SessionState = 'loading' | 'authenticated' | 'unauthenticated';

type SessionContextType =
  | {
      session: null;
      state: 'loading' | 'unauthenticated';
    }
  | {
      session: Session;
      state: 'authenticated';
    };

const defaultContextValue: SessionContextType = {
  session: null,
  state: 'loading',
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

export function ClientSessionProvider({ session, children }: { session: Session; children: ReactNode }) {
  const axios = useClientApi();
  const [auth, setSession] = useState<SessionContextType>({
    state: 'authenticated',
    session,
  });

  const handleSession = useCallback(
    ({ data }: { data: Session | null }) =>
      data
        ? setSession({
            session: data,
            state: 'authenticated',
          })
        : setSession({ state: 'unauthenticated', session: null }),
    [],
  );

  useEffect(() => {
    axios.get<any, { data: Session }>('/auth/session').then(handleSession);
  }, [axios, setSession, handleSession]);

  useInterval(() => {
    axios.get<any, { data: Session }>('/auth/session').then(handleSession);
  }, 300000);

  return <SessionContext.Provider value={auth}>{children}</SessionContext.Provider>;
}

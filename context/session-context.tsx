'use client';

import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import useClientAPI from '@/hooks/use-client';
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

export const SessionContext =
  React.createContext<SessionContextType>(defaultContextValue);

export function useSession(): SessionContextType {
  const context = React.useContext(SessionContext);

  if (!context) {
    throw new Error('Can not use out side of context');
  }

  return context;
}

export function useMe() {
  const { session } = useSession();

  if (!session) {
    return { highestRole: 0 };
  }

  const highestRole = session?.roles.sort(
    (r1, r2) => r1.position - r2.position,
  )[0].position;

  return { highestRole };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const axios = useClientAPI();
  const [auth, setSession] = useState<SessionContextType>({
    state: 'loading',
    session: null,
  });

  useLayoutEffect(() => {
    axios
      .get<any, { data: Session }>('/auth/session')
      .then(({ data }) => data)
      .then((session) =>
        session
          ? setSession({
              session,
              state: 'authenticated',
            })
          : setSession({ state: 'unauthenticated', session: null }),
      );
  }, [axios, setSession]);

  useInterval(() => {
    axios
      .get<any, { data: Session }>('/auth/session')
      .then(({ data }) => data)
      .then((session) =>
        session
          ? setSession({
              session,
              state: 'authenticated',
            })
          : setSession({ state: 'unauthenticated', session: null }),
      );
  }, 300000);

  return (
    <SessionContext.Provider value={auth}>{children}</SessionContext.Provider>
  );
}

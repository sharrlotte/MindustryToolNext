import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { getSession } from '@/action/action';
import ClientSessionProvider from '@/context/session-context.client';
import { Config, DEFAULT_PAGINATION_SIZE, DEFAULT_PAGINATION_TYPE, PAGINATION_SIZE_PERSISTENT_KEY, PAGINATION_TYPE_PERSISTENT_KEY, SHOW_NAV_PERSISTENT_KEY, paginationTypes } from '@/context/session-context.type';
import { isError } from '@/lib/utils';

export async function SessionProvider({ children }: { children: ReactNode }) {
  const cookie = await cookies();
  let session = await getSession();

  if (isError(session)) {
    session = null;
  }

  const paginationSizeString = cookie.get(PAGINATION_SIZE_PERSISTENT_KEY)?.value;
  const paginationType = cookie.get(PAGINATION_TYPE_PERSISTENT_KEY)?.value as any;

  const config: Config = {
    paginationType: paginationTypes.includes(paginationType) ? paginationType : DEFAULT_PAGINATION_TYPE,
    paginationSize: paginationSizeString ? Number(paginationSizeString) : DEFAULT_PAGINATION_SIZE,
  };

  return (
    <ClientSessionProvider
      session={
        session
          ? {
              session,
              state: 'authenticated',
              config,
              createdAt: Date.now(),
            }
          : { state: 'unauthenticated', session: null, createdAt: Date.now(), config }
      }
    >
      {children}
    </ClientSessionProvider>
  );
}

import { ReactNode } from 'react';

import { getSession } from '@/action/action';
import { ClientSessionProvider } from '@/context/session-context.client';
import { isError } from '@/lib/utils';

export async function SessionProvider({ children }: { children: ReactNode }) {
  let session = await getSession();

  if (isError(session)) {
    session = null;
  }

  return <ClientSessionProvider session={session}>{children}</ClientSessionProvider>;
}

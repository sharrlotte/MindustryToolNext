import { getSession } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import { ClientSessionProvider } from '@/context/session-context.client';
import { isError } from '@/lib/utils';
import { ReactNode } from 'react';

export async function SessionProvider({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  return <ClientSessionProvider session={session}>{children}</ClientSessionProvider>;
}

import { ReactNode } from 'react';

import { Filter, hasAccess } from '@/lib/utils';
import { Session } from '@/types/response/Session';
import { ApiError } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  filter?: Filter;
  session: Session | null | ApiError;
  alt?: ReactNode;
  children: ReactNode;
};

export default function ProtectedElement({
  children,
  alt,
  filter,
  session,
}: Props) {
  if (session && 'error' in session) {
    return <ErrorScreen error={session} />;
  }

  return hasAccess(session, filter) ? children : alt;
}

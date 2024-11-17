import { ReactNode } from 'react';

import { ApiError } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import { Filter, hasAccess, isError } from '@/lib/utils';
import { Session } from '@/types/response/Session';

type Props = {
  filter?: Filter;
  session: Session | null | ApiError;
  alt?: ReactNode;
  children: ReactNode;
};

export default function ProtectedElement({ children, alt, filter, session }: Props) {
  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  return hasAccess(session, filter) ? children : alt;
}

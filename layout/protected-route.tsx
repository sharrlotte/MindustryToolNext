import React, { ReactNode } from 'react';

import RequireLogin from '@/components/common/require-login';
import { Session } from '@/types/response/Session';
import Tran from '@/components/common/tran';
import { ApiError } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import { Filter, hasAccess } from '@/lib/utils';

type Props = {
  filter: Filter;
  children: ReactNode;
  session: Session | null | ApiError;
};

function NoPermission() {
  return <Tran text="no-access" />;
}

export default function ProtectedRoute({ filter, children, session }: Props) {
  if (session && 'error' in session) {
    return <ErrorScreen error={session} />;
  }

  if (!session || session.roles === undefined || session.roles === null)
    return <RequireLogin />;

  const canAccess = hasAccess(session, filter);

  if (!canAccess) {
    return <NoPermission />;
  }

  return children;
}

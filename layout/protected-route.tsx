import React, { ReactNode } from 'react';

import RequireLogin from '@/components/common/require-login';
import { Session } from '@/types/response/Session';
import Tran from '@/components/common/tran';
import { ApiError } from '@/action/action';
import { Filter, hasAccess, isError } from '@/lib/utils';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  filter: Filter;
  children: ReactNode;
  session: Session | null | ApiError;
};

function NoPermission() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Tran text="no-access" />
    </div>
  );
}

export default function ProtectedRoute({ filter, children, session }: Props) {
  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  if (!session || session.roles === undefined || session.roles === null) return <RequireLogin />;

  const canAccess = hasAccess(session, filter);

  if (!canAccess) {
    console.error(filter, session);
    return <NoPermission />;
  }

  return children;
}

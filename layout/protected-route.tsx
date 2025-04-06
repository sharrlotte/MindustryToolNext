import React, { ReactNode } from 'react';

import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';

import { ApiError } from '@/action/action';
import { Filter, hasAccess, isError } from '@/lib/utils';
import { Session } from '@/types/response/Session';

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

  const canAccess = hasAccess(session, filter);

  if (!canAccess) {
    return <NoPermission />;
  }

  return children;
}

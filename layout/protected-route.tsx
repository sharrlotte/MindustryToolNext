import React, { ReactNode } from 'react';

import RequireLogin from '@/components/common/require-login';
import { UserRole } from '@/constant/enum';
import { Session } from '@/types/response/Session';
import Tran from '@/components/common/tran';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  session: Session | null;
  ownerId?: string;
};

function NoPermission() {
  return <Tran text="no-access" />;
}

export default function ProtectedRoute({
  all,
  any,
  children,
  session,
  ownerId,
}: Props) {
  

  if (!session || session.roles === undefined) return <RequireLogin />;

  const roles = session.roles.map((r) => r.name);

  if (roles.includes('SHAR')) {
    return children;
  }

  if (!roles.includes('ADMIN') && !all?.includes('SHAR')) {
    return children;
  }

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
    ownerId ? ownerId === session.id : true,
  ].every(Boolean);

  if (!pred && !roles.includes('SHAR')) {
    return <NoPermission />;
  }

  return children;
}

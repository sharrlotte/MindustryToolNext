import { UserRole } from '@/types/response/User';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  session: Session | null;
};

export default function ProtectedElement({
  all,
  any,
  children,
  session,
}: Props) {
  if (!session?.user?.role) return <></>;

  if (any && all) {
    if (
      all.every((role) => session.user?.role.includes(role)) &&
      any.some((role) => session.user?.role.includes(role))
    ) {
      return <>{children}</>;
    }
  }

  if (any) {
    if (any.some((role) => session.user?.role.includes(role))) {
      return <>{children}</>;
    }
  }

  if (all) {
    if (all.every((role) => session.user?.role.includes(role))) {
      return <>{children}</>;
    }
  }

  return <></>;
}

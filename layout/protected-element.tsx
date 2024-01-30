import { UserRole } from '@/constant/enum';
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
  if (!session?.user?.roles) return <></>;

  const roles = session.user.roles;

  if (any && all) {
    if (
      all.every((role) => roles.includes(role)) &&
      any.some((role) => roles.includes(role))
    ) {
      return <>{children}</>;
    }
  }

  if (any) {
    if (any.some((role) => roles.includes(role))) {
      return <>{children}</>;
    }
  }

  if (all) {
    if (all.every((role) => roles.includes(role))) {
      return <>{children}</>;
    }
  }

  return <></>;
}

import { UserRole } from '@/constant/enum';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  ownerId?: string;
  session: Session | null;
};

export default function ProtectedElement({
  all,
  any,
  ownerId,
  children,
  session,
}: Props) {
  if (!session?.user?.roles) return <></>;

  const roles = session.user.roles;

  if (roles.includes('ADMIN')){
    return <>{children}</>;
  }

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
    ownerId ? ownerId === session.user.id : true,
  ].every(Boolean);

  if (!pred) {
    return <></>;
  }

  return <>{children}</>;
}


import { UserRole } from '@/constant/enum';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  show?: boolean;
  ownerId?: string;
  session: Session | null;
  alt?: ReactNode;
  passOnEmpty?: boolean;
};

export default function ProtectedElement({
  all,
  any,
  ownerId,
  children,
  show,
  session,
  alt,
  passOnEmpty,
}: Props) {
  if (!session?.user?.roles) return passOnEmpty ? children : alt;

  const roles = session.user.roles;

  if (roles.includes('ADMIN')) {
    return <>{children}</>;
  }

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
    ownerId ? ownerId === session.user.id : true,
    show === undefined ? true : show,
  ].every(Boolean);

  if (!pred) {
    return alt;
  }

  return <>{children}</>;
}

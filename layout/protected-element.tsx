import React, { ReactNode } from 'react';

import { UserRole } from '@/constant/enum';
import { Session } from '@/types/response/Session';

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
  if (!session || session.roles === null) {
    return passOnEmpty && !all && !any ? children : alt;
  }

  const roles = session.roles.map((r) => r.name);

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
    ownerId ? ownerId === session.id : true,
    show === undefined ? true : show,
  ].every(Boolean);

  if (!pred && !roles.includes('SHAR')) {
    return alt;
  }

  return <>{children}</>;
}

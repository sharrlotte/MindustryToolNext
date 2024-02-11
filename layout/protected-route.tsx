import LoginButton from '@/components/button/login-button';
import { UserRole } from '@/constant/enum';
import { Session } from 'next-auth';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  any?: UserRole[];
  all?: UserRole[];
  session: Session | null;
};

function NoPermission() {
  return <span>You don have permission to access this page</span>;
}

export default async function ProtectedRoute({
  all,
  any,
  children,
  session,
}: Props) {
  if (!session?.user?.roles)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        Please login to continue
        <LoginButton className="min-w-[100px]" title="login" />
      </div>
    );

  const roles = session.user.roles;

  const pred = [
    all ? all.every((role) => roles.includes(role)) : true,
    any ? any.some((role) => roles.includes(role)) : true,
  ].every(Boolean);

  if (!pred) {
    return <NoPermission />;
  }

  return <>{children}</>;
}

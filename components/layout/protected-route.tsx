import LoginButton from '@/components/common/login-button';
import { UserRole } from '@/types/response/User';
import { signIn } from 'next-auth/react';
import { Session } from 'next-auth/types';
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
  if (!session?.user.roles)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        Role;{session?.user.roles}
        Please login to continute
        <LoginButton className="min-w-[100px]" />
      </div>
    );
  if (any && all) {
    if (
      all.every((role) => session?.user.roles.includes(role)) &&
      any.some((role) => session?.user.roles.includes(role))
    ) {
      return <>{children}</>;
    } else {
      <NoPermission />;
    }
  }

  if (any) {
    if (any.some((role) => session?.user.roles.includes(role))) {
      return <>{children}</>;
    } else {
      <NoPermission />;
    }
  }

  if (all) {
    if (all.some((role) => session?.user.roles.includes(role))) {
      return <>{children}</>;
    } else {
      <NoPermission />;
    }
  }
  throw new Error('No role configured');
}

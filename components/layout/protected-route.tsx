import LoginButton from '@/components/common/login-button';
import { UserRole } from '@/constant/enum';
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
  if (!session?.user?.role)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        Please login to continue
        <LoginButton className="min-w-[100px]" title="login" />
      </div>
    );
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
  <NoPermission />;
}

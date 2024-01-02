import { cn } from '@/lib/utils';
import { UserRole } from '@/constant/enum';
import React, { ReactNode } from 'react';

type ColorAsRoleProps = {
  className: string;
  children: ReactNode;
  roles: UserRole[] | undefined;
};

export default function ColorAsRole({
  className,
  children,
  roles,
}: ColorAsRoleProps) {
  const render = (roles: UserRole[] | undefined) => {
    if (!roles) {
      return children;
    }

    if (roles.includes('ADMIN')) {
      return <span>{children}</span>;
    }
  };

  return (
    <span className={cn('text-emerald-400', className)}>{render(roles)}</span>
  );
}

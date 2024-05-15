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
  if (!roles) {
    return <span className={cn(className)}>{children}</span>;
  }

  if (roles.includes('SHAR')) {
    return <span className={cn('text-pink-500', className)}>{children}</span>;
  }

  if (roles.includes('ADMIN')) {
    return (
      <span className={cn('text-emerald-400', className)}>{children}</span>
    );
  }

  return <span className={cn(className)}>{children}</span>;
}

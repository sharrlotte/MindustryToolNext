import { cn } from '@/lib/utils';
import { UserRole } from '@/constant/enum';
import React, { ReactNode } from 'react';

type ColorAsRoleProps = {
  className: string;
  children: ReactNode;
  role: UserRole[];
};

export default function ColorAsRole({
  className,
  children,
  role,
}: ColorAsRoleProps) {
  if (role.includes('ADMIN')) {
    return (
      <span className={cn('text-emerald-400', className)}>{children}</span>
    );
  }

  return <span>{children}</span>;
}

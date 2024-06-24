import React, { ReactNode } from 'react';

import { UserRole } from '@/constant/enum';
import { cn } from '@/lib/utils';

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

  if (roles.includes('SERVER')) {
    return <span className={cn('text-purple-600', className)}>{children}</span>;
  }

  if (roles.includes('BOT')) {
    return <span className={cn('text-blue-600', className)}>{children}</span>;
  }

  return <span className={cn(className)}>{children}</span>;
}

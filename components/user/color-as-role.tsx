import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Role } from '@/types/response/Role';

type ColorAsRoleProps = {
  className: string;
  children: ReactNode;
  roles: Role[] | undefined;
};

export default function ColorAsRole({ className, children, roles }: ColorAsRoleProps) {
  const roleNames = roles?.map((r) => r.name) ?? [];

  if (!roles) {
    return <span className={cn(className)}>{children}</span>;
  }

  if (roleNames.includes('SHAR')) {
    return <span className={cn('text-pink-500', className)}>{children}</span>;
  }

  if (roleNames.includes('ADMIN')) {
    return <span className={cn('text-emerald-400', className)}>{children}</span>;
  }

  return <span className={cn(className)}>{children}</span>;
}

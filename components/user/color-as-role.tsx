import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Role } from '@/types/response/Role';

type ColorAsRoleProps = {
  className: string;
  children: ReactNode;
  roles: Role[] | undefined;
};

export default function ColorAsRole({ className, children, roles }: ColorAsRoleProps) {
  if (!roles || roles.length === 0) {
    return <span>{children}</span>;
  }

  const bestRole = roles.sort((a, b) => b.position - a.position)[0];

  return (
    <span className={cn(className)} style={{ color: bestRole.color }}>
      {children}
    </span>
  );
}

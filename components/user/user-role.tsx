import React from 'react';

import { cn } from '@/lib/utils';
import { Role } from '@/types/response/Role';

type UserRoleCardProps = {
  className?: string;
  roles: Role[];
};

export default function UserRoleCard({ className, roles }: UserRoleCardProps) {
  if (!roles || roles.length === 0) {
    return null;
  }

  const highestRole = roles.sort((r1, r2) => r2?.position - r1?.position)[0] || 0;

  return (
    <span className={cn('font-bold', className)} style={{ color: highestRole.color }}>
      {highestRole.name}
    </span>
  );
}

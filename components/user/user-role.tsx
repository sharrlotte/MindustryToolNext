import { UserRole } from '@/constant/enum';
import { cn } from '@/lib/utils';

import React from 'react';

type UserRoleCardProps = {
  className?: string;
  roles: UserRole[];
};

export default function UserRoleCard({ className, roles }: UserRoleCardProps) {
  if (!roles) {
    return <></>;
  }

  if (roles.includes('ADMIN')) {
    return (
      <span className={cn('text-bold text-emerald-400', className)}>ADMIN</span>
    );
  }

  return null;
}

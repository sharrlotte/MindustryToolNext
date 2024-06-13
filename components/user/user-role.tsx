import React from 'react';

import { UserRole } from '@/constant/enum';
import { cn } from '@/lib/utils';

type UserRoleCardProps = {
  className?: string;
  roles: UserRole[];
};

export default function UserRoleCard({ className, roles }: UserRoleCardProps) {
  if (!roles) {
    return <></>;
  }

  if (roles.includes('SHAR')) {
    return (
      <span className={cn('font-bold text-pink-400', className)}>SHAR</span>
    );
  }

  if (roles.includes('ADMIN')) {
    return (
      <span className={cn('font-bold text-emerald-400', className)}>ADMIN</span>
    );
  }

  return null;
}

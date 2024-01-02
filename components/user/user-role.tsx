import { UserRole } from '@/constant/enum';
import React from 'react';

type UserRoleCardProps = {
  roles: UserRole[];
};

export default function UserRoleCard({ roles }: UserRoleCardProps) {
  if (!roles) {
    return <></>;
  }

  if (roles.includes('ADMIN')) {
    return <span className="text-bold text-emerald-400">ADMIN</span>;
  }

  if (roles.includes('USER')) {
    return <span className="text-bold">USER</span>;
  }

  return null;
}

import { UserRole } from '@/constant/enum';
import React from 'react';

type UserRoleCardProps = {
  role: UserRole[];
};

export default function UserRoleCard({ role }: UserRoleCardProps) {
  if (role.includes('ADMIN')) {
    return <span className="text-bold text-emerald-400">ADMIN</span>;
  }

  if (role.includes('USER')) {
    return <span className="text-bold">USER</span>;
  }

  return null;
}

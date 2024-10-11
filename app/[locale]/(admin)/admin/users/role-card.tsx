import Tran from '@/components/common/tran';
import { TableCell, TableRow } from '@/components/ui/table';
import { RoleWithAuthorities } from '@/types/response/Role';
import React from 'react';

type Props = {
  role: RoleWithAuthorities;
};

export default function RoleCard({ role }: Props) {
  const { name, color, authorities } = role;

  return (
    <TableRow>
      <TableCell>
        <Tran className={color} text={name.toLowerCase()} />
      </TableCell>
      <TableCell>{authorities}</TableCell>
    </TableRow>
  );
}

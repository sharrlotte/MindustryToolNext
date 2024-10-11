import ChangeRoleAuthorityDialog from '@/app/[locale]/(admin)/admin/users/change-role-authority-dialog';
import Tran from '@/components/common/tran';
import { TableCell, TableRow } from '@/components/ui/table';
import { RoleWithAuthorities } from '@/types/response/Role';
import React from 'react';

type Props = {
  role: RoleWithAuthorities;
};

export default function RoleCard({ role }: Props) {
  const { name, color } = role;

  return (
    <TableRow>
      <TableCell>
        <Tran className={color} text={name.toLowerCase()} />
      </TableCell>
      <TableCell>
        <ChangeRoleAuthorityDialog role={role} />
      </TableCell>
    </TableRow>
  );
}

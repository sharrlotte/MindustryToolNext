import ChangeRoleAuthorityDialog from '@/app/[locale]/(admin)/admin/users/change-role-authority-dialog';
import UpdateRoleDialog from '@/app/[locale]/(admin)/admin/users/update-role-dialog';
import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
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
      <TableCell className="w-full overflow-hidden text-ellipsis">
        <ChangeRoleAuthorityDialog role={role} />
      </TableCell>
      <TableCell className='justify-center items-center flex'>
        <EllipsisButton variant="ghost">
          <UpdateRoleDialog role={role} />
        </EllipsisButton>
      </TableCell>
    </TableRow>
  );
}

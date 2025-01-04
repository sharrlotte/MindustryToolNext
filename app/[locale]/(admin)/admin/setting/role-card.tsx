import React from 'react';

import ChangeRoleAuthorityDialog from '@/app/[locale]/(admin)/admin/setting/change-role-authority-dialog';
import DeleteRoleButton from '@/app/[locale]/(admin)/admin/setting/delete-role-button';
import UpdateRoleDialog from '@/app/[locale]/(admin)/admin/setting/update-role-dialog';

import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { TableCell, TableRow } from '@/components/ui/table';

import { RoleWithAuthorities } from '@/types/response/Role';

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
      <TableCell className="flex items-center justify-center">
        <EllipsisButton variant="ghost">
          <UpdateRoleDialog role={role} />
          <DeleteRoleButton role={role} />
        </EllipsisButton>
      </TableCell>
    </TableRow>
  );
}

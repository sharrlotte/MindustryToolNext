import React from 'react';

import ChangeRoleAuthorityDialog from '@/app/[locale]/(admin)/admin/setting/roles/change-role-authority-dialog';
import DeleteRoleButton from '@/app/[locale]/(admin)/admin/setting/roles/delete-role-button';
import UpdateRoleDialog from '@/app/[locale]/(admin)/admin/setting/roles/update-role-dialog';

import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { TableCell, TableRow } from '@/components/ui/table';

import { Role, RoleWithAuthorities } from '@/types/response/Role';

type Props = {
  role: RoleWithAuthorities;
  bestRole?: Role;
};

export default function RoleCard({ role, bestRole }: Props) {
  const { name, color, position } = role;

  return (
    <TableRow className="h-14">
      <TableCell>
        <Tran style={{ color }} text={name.toLowerCase()} />
      </TableCell>
      <TableCell className="w-full overflow-hidden text-ellipsis">
        <ChangeRoleAuthorityDialog role={role} />
      </TableCell>
      <TableCell className="flex items-center justify-center">
        {bestRole && (bestRole.position > position || bestRole.name.toUpperCase() === 'SHAR') && (
          <EllipsisButton variant="ghost">
            <UpdateRoleDialog role={role} />
            <DeleteRoleButton role={role} />
          </EllipsisButton>
        )}
      </TableCell>
    </TableRow>
  );
}

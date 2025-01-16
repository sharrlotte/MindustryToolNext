import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { RoleList } from '@/app/[locale]/(admin)/admin/setting/roles/role-list';
import { RoleListSkeleton } from '@/app/[locale]/(admin)/admin/setting/roles/role-list-skeleton';

import Tran from '@/components/common/tran';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CreateRoleDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/roles/create-role-dialog'));

export async function RoleTable() {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      <Table className="table-fixed border-none">
        <TableHeader>
          <TableRow>
            <TableHead className="w-52 overflow-x-auto">
              <Tran text="role" />
            </TableHead>
            <TableHead className="w-full overflow-x-auto">
              <Tran text="authorities" />
            </TableHead>
            <TableHead className="w-20 overflow-x-auto" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense fallback={<RoleListSkeleton />}>
            <RoleList />
          </Suspense>
        </TableBody>
      </Table>
      <div className="flex w-full justify-end">
        <CreateRoleDialog />
      </div>
    </div>
  );
}

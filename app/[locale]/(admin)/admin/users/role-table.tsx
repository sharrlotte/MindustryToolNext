import { RoleList } from '@/app/[locale]/(admin)/admin/users/role-list';
import { RoleListSkeleton } from '@/app/[locale]/(admin)/admin/users/role-list-skeleton';
import Tran from '@/components/common/tran';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { Suspense } from 'react';

export async function RoleTable() {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-40 overflow-x-auto">
            <Tran text="role" />
          </TableHead>
          <TableHead className="w-full overflow-x-auto">
            <Tran text="authorities" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Suspense fallback={<RoleListSkeleton />}>
          <RoleList />
        </Suspense>
      </TableBody>
    </Table>
  );
}

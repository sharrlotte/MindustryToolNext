import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { RoleList } from '@/app/[locale]/(admin)/admin/setting/roles/role-list';
import { RoleListSkeleton } from '@/app/[locale]/(admin)/admin/setting/roles/role-list-skeleton';

import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { getAuthSession, serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getRoles } from '@/query/role';

const CreateRoleDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/roles/create-role-dialog'));

export async function RoleTable() {
  const data = await serverApi(getRoles);
  const session = await getAuthSession();

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const bestRole = session.roles === null || session.roles.length === 0 ? undefined : session.roles.sort((o1, o2) => o2.position - o1.position)[0];

  if (!bestRole) {
    // Should never happen
    return <ErrorScreen error={{ message: 'No available role.' }} />;
  }

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
            <RoleList roles={data} bestRole={bestRole} />
          </Suspense>
        </TableBody>
      </Table>
      <div className="flex w-full justify-end">
        <CreateRoleDialog />
      </div>
    </div>
  );
}

import { serverApi } from '@/action/action';
import RoleCard from '@/app/[locale]/(admin)/admin/users/role-card';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRoles } from '@/query/role';
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

function RoleListSkeleton() {
  return new Array(10).fill(1).map(() => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    </TableRow>
  ));
}

async function RoleList() {
  const result = await serverApi((axios) => getRoles(axios));

  if ('error' in result) {
    return <ErrorScreen error={result} />;
  }

  return result.map((role) => <RoleCard key={role.id} role={role} />);
}

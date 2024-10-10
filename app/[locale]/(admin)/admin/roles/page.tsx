import { serverApi } from '@/action/action';
import RoleCard from '@/app/[locale]/(admin)/admin/roles/role-card';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRoles } from '@/query/role';
import React from 'react';

export default async function Page() {
  const result = await serverApi((axios) => getRoles(axios));

  if ('error' in result) {
    return <ErrorScreen error={result} />;
  }

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
        {result.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </TableBody>
    </Table>
  );
}

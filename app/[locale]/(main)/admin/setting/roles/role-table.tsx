import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

import { RoleList } from '@/app/[locale]/(main)/admin/setting/roles/role-list';
import { RoleListSkeleton } from '@/app/[locale]/(main)/admin/setting/roles/role-list-skeleton';

import ErrorScreen from '@/components/common/error-screen';

import { getAuthSession, serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getRoles } from '@/query/role';

const CreateRoleDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/roles/create-role-dialog'));

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
      <Suspense fallback={<RoleListSkeleton />}>
        <RoleList roles={data} bestRole={bestRole} />
      </Suspense>
      <div className="flex w-full justify-end">
        <CreateRoleDialog />
      </div>
    </div>
  );
}

import { Suspense } from 'react';

import RoleCard from '@/app/[locale]/(admin)/admin/setting/roles/role-card';

import ErrorScreen from '@/components/common/error-screen';

import { serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getRoles } from '@/query/role';

export async function RoleList() {
  const data = await serverApi(getRoles);

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  return data
    ?.sort((o1, o2) => o2.position - o1.position)
    .map((role) => (
      <Suspense key={role.id}>
        <RoleCard role={role} />
      </Suspense>
    ));
}

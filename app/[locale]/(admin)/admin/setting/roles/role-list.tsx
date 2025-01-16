import { Suspense } from 'react';

import RoleCard from '@/app/[locale]/(admin)/admin/setting/roles/role-card';

import ErrorScreen from '@/components/common/error-screen';

import { getAuthSession, serverApi } from '@/action/action';
import { isError } from '@/lib/utils';
import { getRoles } from '@/query/role';

export async function RoleList() {
  const data = await serverApi(getRoles);
  const session = await getAuthSession();

  if (isError(data)) {
    return <ErrorScreen error={data} />;
  }

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const bestPosition = session.roles === null || session.roles.length === 0 ? 0 : session.roles.sort((o1, o2) => o2.position - o1.position)[0].position;

  return data
    ?.sort((o1, o2) => o2.position - o1.position)
    .map((role) => (
      <Suspense key={role.id}>
        <RoleCard role={role} bestPosition={bestPosition} />
      </Suspense>
    ));
}

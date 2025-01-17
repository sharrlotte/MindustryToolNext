'use client';

import { Suspense } from 'react';

import RoleCard from '@/app/[locale]/(admin)/admin/setting/roles/role-card';

import useClientApi from '@/hooks/use-client';
import { getRoles } from '@/query/role';
import { Role, RoleWithAuthorities } from '@/types/response/Role';

import { useQuery } from '@tanstack/react-query';

type Props = {
  roles: RoleWithAuthorities[];
  bestRole: Role;
};
export function RoleList({ roles, bestRole }: Props) {
  const axios = useClientApi();

  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(axios),
    initialData: roles,
  });

  return data
    ?.sort((o1, o2) => o2.position - o1.position)
    .map((role) => (
      <Suspense key={role.id}>
        <RoleCard role={role} bestRole={bestRole} />
      </Suspense>
    ));
}

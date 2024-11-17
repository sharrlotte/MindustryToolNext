'use client';

import RoleCard from '@/app/[locale]/(admin)/admin/users/role-card';
import ErrorScreen from '@/components/common/error-screen';
import useClientQuery from '@/hooks/use-client-query';
import { getRoles } from '@/query/role';

export function RoleList() {
  const { data, error } = useClientQuery({ queryFn: (axios) => getRoles(axios), queryKey: ['roles'] });

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return data?.sort((o1, o2) => o2.position - o1.position).map((role) => <RoleCard key={role.id} role={role} />);
}

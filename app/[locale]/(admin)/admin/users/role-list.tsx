import { isError } from '@/lib/utils';
import { serverApi } from '@/action/action';
import RoleCard from '@/app/[locale]/(admin)/admin/users/role-card';
import ErrorScreen from '@/components/common/error-screen';
import { getRoles } from '@/query/role';

export async function RoleList() {
  const result = await serverApi((axios) => getRoles(axios));

  if (isError(result)) {
    return <ErrorScreen error={result} />;
  }

  return result.sort((o1, o2) => o2.position - o1.position).map((role) => <RoleCard key={role.id} role={role} />);
}

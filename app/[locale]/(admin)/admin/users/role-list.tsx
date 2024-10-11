import { serverApi } from '@/action/action';
import RoleCard from '@/app/[locale]/(admin)/admin/users/role-card';
import ErrorScreen from '@/components/common/error-screen';
import { getRoles } from '@/query/role';

export async function RoleList() {
  const result = await serverApi((axios) => getRoles(axios));

  if ('error' in result) {
    return <ErrorScreen error={result} />;
  }

  return result.map((role) => <RoleCard key={role.id} role={role} />);
}

import { AxiosInstance } from 'axios';
import { Role } from '@/types/response/Role';

export async function changeRoles(
  axios: AxiosInstance,
  data: { userId: string; roleIds: number[] },
): Promise<void> {
  const { userId, roleIds } = data;

  const result = await axios.put(
    `/users/${userId}/roles`,
    { roleIds },
    { data: { roleIds } },
  );

  return result.data;
}

export async function getRoles(axios: AxiosInstance): Promise<Role[]> {
  const result = await axios.get(`/roles`);

  return result.data;
}

import { AxiosInstance } from 'axios';


export default async function changeRoles(
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

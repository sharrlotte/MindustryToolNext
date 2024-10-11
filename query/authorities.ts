import { Authority } from '@/types/response/Role';
import { AxiosInstance } from 'axios';

export async function changeAuthorities(
  axios: AxiosInstance,
  data: { roleId: number; authorityIds: string[] },
): Promise<void> {
  const { roleId, authorityIds } = data;

  const result = await axios.put(
    `/roles/${roleId}/authorities`,
    { authorityIds },
    { data: { authorityIds } },
  );

  return result.data;
}

export async function getAuthorities(
  axios: AxiosInstance,
): Promise<Authority[]> {
  const result = await axios.get(`/authorities`);

  return result.data;
}

import { AxiosInstance } from 'axios';

import { Role } from '@/types/response/Role';

export default async function getRoles(axios: AxiosInstance): Promise<Role[]> {
  const result = await axios.get(`/roles`);

  return result.data;
}

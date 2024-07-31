import { AxiosInstance } from 'axios';

import { ServerFile } from '@/types/response/ServerFile';

export default async function getServerFiles(
  axios: AxiosInstance,
  id: string,
  path: string,
): Promise<ServerFile[]> {
  const result = await axios.get(`/internal-servers/${id}/files`, {
    params: { path },
  });

  return result.data;
}

import { AxiosInstance } from 'axios';

import ServerFile from '@/types/response/ServerFile';

export default async function getServerFiles(
  axios: AxiosInstance,
  path: string,
): Promise<ServerFile[]> {
  const result = await axios.get(`/files`, {
    params: { path },
  });

  return result.data;
}

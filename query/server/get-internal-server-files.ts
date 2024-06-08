import InternalServerFile from '@/types/response/InternalServerFile';

import { AxiosInstance } from 'axios';

export default async function getInternalServerFiles(
  axios: AxiosInstance,
  id: string,
  path: string,
): Promise<InternalServerFile[]> {
  const result = await axios.get(`/internal-servers/${id}/files`, {
    params: { path },
  });

  return result.data;
}

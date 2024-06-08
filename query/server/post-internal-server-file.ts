import { toForm } from '@/lib/utils';

import { AxiosInstance } from 'axios';

export default async function postInternalServerFile(
  axios: AxiosInstance,
  serverId: string,
  path: string,
  file: File,
): Promise<void> {
  const form = toForm({ file });

  return axios.post(`/internal-servers/${serverId}/files`, form, {
    params: { path },
    data: form,
  });
}

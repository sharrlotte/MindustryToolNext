import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';

export default async function postServerFile(
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

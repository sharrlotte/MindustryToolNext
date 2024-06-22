import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';

export default async function postServerFile(
  axios: AxiosInstance,
  path: string,
  file: File,
): Promise<void> {
  const form = toForm({ file });

  return axios.post(`/files`, form, {
    params: { path },
    data: form,
  });
}

import { toForm } from '@/lib/utils';
import { PostPluginRequest } from '@/types/request/PostPluginRequest';
import { AxiosInstance } from 'axios';

export default async function postPlugin(
  axios: AxiosInstance,
  { file, ...data }: PostPluginRequest,
): Promise<void> {
  const form = toForm(data);

  form.append('file', file);

  return axios.post('/plugins', form, {
    data: form,
  });
}

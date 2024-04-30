import { toForm } from '@/lib/utils';
import { PostPluginRequest } from '@/types/request/PostPluginRequest';
import { AxiosInstance } from 'axios';

export default async function postSchematic(
  axios: AxiosInstance,
  data: PostPluginRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/plugins', form, {
    data: form,
  });
}

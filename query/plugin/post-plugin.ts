import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { PostPluginRequest } from '@/types/request/PostPluginRequest';

export default async function postPlugin(
  axios: AxiosInstance,
  data: PostPluginRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/plugins', form, {
    data: form,
  });
}

import { toForm } from '@/lib/utils';
import PostInternalServerPluginRequest from '@/types/request/PostInternalServerPluginRequest';

import { AxiosInstance } from 'axios';

export default async function postInternalServerPlugin(
  axios: AxiosInstance,
  serverId: string,
  data: PostInternalServerPluginRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post(`/internal-servers/${serverId}/plugins`, form, {
    data: form,
  });
}

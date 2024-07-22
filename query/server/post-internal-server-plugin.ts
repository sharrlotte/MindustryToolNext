import { AxiosInstance } from 'axios';

import PostInternalServerPluginRequest from '@/types/request/PostInternalServerPluginRequest';

export default async function postInternalServerPlugin(
  axios: AxiosInstance,
  serverId: string,
  data: PostInternalServerPluginRequest,
): Promise<void> {
  return axios.post(`/internal-servers/${serverId}/plugins`, data, {
    data,
  });
}

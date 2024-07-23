import { AxiosInstance } from 'axios';

import PostInternalServerMapRequest from '@/types/request/PostInternalServerMapRequest';

export default async function postInternalServerMap(
  axios: AxiosInstance,
  serverId: string,
  data: PostInternalServerMapRequest,
): Promise<void> {
  return axios.post(`/internal-servers/${serverId}/maps`, data, {
    data,
  });
}

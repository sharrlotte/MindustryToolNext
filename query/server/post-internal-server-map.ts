import { toForm } from '@/lib/utils';
import PostInternalServerMapRequest from '@/types/request/PostInternalServerMapRequest';

import { AxiosInstance } from 'axios';

export default async function postInternalServerMap(
  axios: AxiosInstance,
  serverId: string,
  data: PostInternalServerMapRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post(`/internal-servers/${serverId}/maps`, form, {
    data: form,
  });
}

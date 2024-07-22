import { AxiosInstance } from 'axios';

import { PostPluginRequest } from '@/types/request/PostPluginRequest';

export default async function postPlugin(
  axios: AxiosInstance,
  data: PostPluginRequest,
): Promise<void> {
  return axios.post('/plugins', data, {
    data,
  });
}

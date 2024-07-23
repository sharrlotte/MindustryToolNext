import { AxiosInstance } from 'axios';

import VerifyPluginRequest from '@/types/request/VerifyPluginRequest';

export default async function postVerifyPlugin(
  axios: AxiosInstance,
  { id, tags }: VerifyPluginRequest,
): Promise<void> {
  return axios.post(
    `/plugins/${id}/verify`,
    { tags },
    {
      data: { tags },
    },
  );
}

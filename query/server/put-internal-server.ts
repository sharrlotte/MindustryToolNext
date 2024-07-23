import { AxiosInstance } from 'axios';

import { PutInternalServerRequest } from '@/types/request/PutInternalServerRequest';

export default async function putInternalServer(
  axios: AxiosInstance,
  serverId: string,
  data: PutInternalServerRequest,
): Promise<void> {
  return axios.put(`/internal-servers/${serverId}`, data, {
    data,
  });
}

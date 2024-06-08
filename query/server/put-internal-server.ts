import { toForm } from '@/lib/utils';
import { PutInternalServerRequest } from '@/types/request/PutInternalServerRequest';

import { AxiosInstance } from 'axios';

export default async function putInternalServer(
  axios: AxiosInstance,
  serverId: string,
  data: PutInternalServerRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.put(`/internal-servers/${serverId}`, form, {
    data: form,
  });
}

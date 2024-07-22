import { AxiosInstance } from 'axios';

import VerifyMapRequest from '@/types/request/VerifyMapRequest';

export default async function postVerifyMap(
  axios: AxiosInstance,
  { id, tags }: VerifyMapRequest,
): Promise<void> {
  return axios.post(
    `/maps/${id}/verify`,
    { tags },
    {
      data: { tags },
    },
  );
}

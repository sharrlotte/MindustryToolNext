import { AxiosInstance } from 'axios';

import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';

export default async function postVerifySchematic(
  axios: AxiosInstance,
  { id, tags }: VerifySchematicRequest,
): Promise<void> {
  const data = { tags };

  return axios.post(`/schematics/${id}/verify`, data, {
    data,
  });
}

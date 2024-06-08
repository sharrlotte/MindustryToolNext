import { toForm } from '@/lib/utils';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';

import { AxiosInstance } from 'axios';

export default async function postVerifySchematic(
  axios: AxiosInstance,
  { id, tags }: VerifySchematicRequest,
): Promise<void> {
  const form = toForm({ tags });

  return axios.post(`/schematics/${id}/verify`, form, {
    data: form,
  });
}

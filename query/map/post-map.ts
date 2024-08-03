import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { UploadMapRequest } from '@/types/schema/zod-schema';

export default async function postMap(
  axios: AxiosInstance,
  data: UploadMapRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/maps', form, {
    data: form,
  });
}

import { AxiosInstance } from 'axios';

import { toForm } from '@/lib/utils';
import { PostDocumentRequest } from '@/types/request/PostDocumentRequest';

export default async function postDocument(
  axios: AxiosInstance,
  data: PostDocumentRequest,
): Promise<void> {
  const form = toForm(data);

  return axios.post('/documents', form, {
    data: form,
  });
}

import { AxiosInstance } from 'axios';

import { PostDocumentRequest } from '@/types/request/PostDocumentRequest';

export default async function postDocument(
  axios: AxiosInstance,
  data: PostDocumentRequest,
): Promise<void> {
  return axios.post('/documents', data, {
    data,
  });
}

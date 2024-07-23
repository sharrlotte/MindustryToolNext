import { AxiosInstance } from 'axios';

import VerifyPostRequest from '@/types/request/VerifyPostRequest';

export default async function postVerifyPost(
  axios: AxiosInstance,
  { id, tags }: VerifyPostRequest,
): Promise<void> {
  const data = { tags };
  return axios.post(`/posts/${id}/verify`, data, {
    data,
  });
}

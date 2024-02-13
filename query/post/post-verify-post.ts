import { toForm } from '@/lib/utils';
import VerifyPostRequest from '@/types/request/VerifyPostRequest';
import { AxiosInstance } from 'axios';

export default async function postVerifyPost(
  axios: AxiosInstance,
  { id, tags }: VerifyPostRequest,
): Promise<void> {
  const form = toForm({ tags });

return axios.post(`/posts/${id}/verify`, form, {
    data: form,
  });
}

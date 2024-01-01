import { LikePostRequest } from '@/types/request/LikePostRequest';
import { LikeChange } from '@/types/response/LikeChange';
import { AxiosInstance } from 'axios';

export default async function postLike(
  axios: AxiosInstance,
  data: LikePostRequest,
): Promise<LikeChange> {
  const result = await axios.post('/likes', data);

  return result.data;
}

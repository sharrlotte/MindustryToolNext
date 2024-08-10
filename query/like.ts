import { CreateLikeRequest } from '@/types/request/CreateLikeRequest';
import { LikeChange } from '@/types/response/LikeChange';

import { AxiosInstance } from 'axios';

export async function postLike(
  axios: AxiosInstance,
  data: CreateLikeRequest,
): Promise<LikeChange> {
  const result = await axios.post('/likes', data);

  return result.data;
}

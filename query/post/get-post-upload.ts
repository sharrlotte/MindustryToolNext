import { IdSearchParams } from '@/types/data/id-search-schema';
import { PostDetail } from '@/types/response/PostDetail';
import { AxiosInstance } from 'axios';

export default async function getPostUpload(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<PostDetail> {
  const result = await axios.get(`/posts/upload/${id}`);
  return result.data;
}

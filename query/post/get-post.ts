import { IdSearchParams } from '@/types/data/search-id-schema';
import Post from '@/types/response/Post';
import { AxiosInstance } from 'axios';

export default async function getPost(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<Post> {
  const result = await axios.get(`/posts/${id}`);
  return result.data;
}

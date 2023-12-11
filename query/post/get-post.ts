import axiosClient from '@/query/config/axios-config';
import { IdSearchParams } from '@/schema/search-id-schema';
import Post from '@/types/response/Post';

export default async function getPost({ id }: IdSearchParams): Promise<Post> {
  const result = await axiosClient.get(`/posts/${id}`);
  return result.data;
}

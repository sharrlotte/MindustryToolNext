import axiosClient from '@/query/config/axios-config';
import { SearchParams, searchSchema } from '@/schema/search-schema';
import Post from '@/types/response/Post';

export default async function getPosts(params: SearchParams): Promise<Post[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axiosClient.get('/posts', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
